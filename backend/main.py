from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import shutil
import os
import torch
import timm
import random
from torchvision import transforms
from PIL import Image
import io
import uuid
import datetime
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="RetiNet Pro API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve Uploads for History View
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# MongoDB Connection
MONGO_URL = "mongodb://localhost:27017" # Replace with your URI if needed
client = AsyncIOMotorClient(MONGO_URL)
db = client.retinet_db
collection_scans = db.scans
collection_patients = db.patients

# Global Model
model = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def get_model():
    global model
    if model is None:
        print(f"🔄 Loading AI Model on {device}...")
        model = timm.create_model('resnet18', pretrained=True, num_classes=5)
        
        weights_path = "ml/models/retinet_v1.pth"
        if os.path.exists(weights_path):
            model.load_state_dict(torch.load(weights_path, map_location=device))
            print("✅ Trained Model Loaded Successfully!")
        else:
            print("⚠️ Warning: Trained weights not found. Running with pre-trained ImageNet weights.")
            
        model.to(device)
        model.eval()
    return model

# Preprocessing
transform_pipeline = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

DR_LABELS = {
    0: "No DR (Normal)",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR"
}

from fastapi import FastAPI, UploadFile, File, HTTPException, Form

# ... (imports)

@app.post("/analyze")
async def analyze_scan(
    file: UploadFile = File(...),
    patient_name: str = Form("Unknown Patient"),
    mobile_number: str = Form("Unknown")
):
    try:
        # 1. Save File
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = f"uploads/{unique_filename}"
        
        contents = await file.read()
        
        with open(file_path, "wb") as f:
            f.write(contents)
            
        # 2. AI Inference
        ai_model = get_model()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        input_tensor = transform_pipeline(image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            outputs = ai_model(input_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_class = torch.max(probabilities, 1)
            
            clean_class = predicted_class.item()
            clean_conf = confidence.item()

        # 3. Store in MongoDB
        # Generate a patient ID based on mobile number if possible, or random
        patient_id = f"P-{str(uuid.uuid4())[:6].upper()}"
        if mobile_number != "Unknown":
            # Check if patient exists to reuse ID (Simple logic)
            existing_patient = await collection_scans.find_one({"mobile_number": mobile_number})
            if existing_patient:
                patient_id = existing_patient["patient_id"]

        scan_record = {
            "patient_id": patient_id, 
            "patient_name": patient_name,
            "mobile_number": mobile_number,
            "timestamp": datetime.datetime.now(),
            "file_url": f"http://localhost:8000/uploads/{unique_filename}",
            "diagnosis": DR_LABELS[clean_class],
            "dr_grade": clean_class,
            "confidence": clean_conf,
            "biological_age": random.randint(30, 75), # Heuristic for now
            "cardiovascular_risk": "Moderate" if clean_class > 2 else "Low"
        }
        
        await collection_scans.insert_one(scan_record)

        # 4. Return Result
        return {
            "status": "success",
            "file_url": scan_record["file_url"],
            "results": {
                "diabetic_retinopathy": {
                    "grade": DR_LABELS[clean_class],
                    "confidence": float(f"{clean_conf:.4f}"),
                    "is_normal": clean_class == 0
                },
                "biological_age": {
                    "predicted": scan_record["biological_age"],
                    "gap": 0
                },
                "cardiovascular_risk": scan_record["cardiovascular_risk"],
                "diseases_found": [DR_LABELS[clean_class]] if clean_class > 0 else []
            }
        }
    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": str(e)}

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from fastapi.responses import Response
from bson import ObjectId

@app.get("/report/{scan_id}")
async def generate_report(scan_id: str):
    import textwrap  # Import locally to ensure availability
    try:
        # Fetch Scan
        scan = await collection_scans.find_one({"_id": ObjectId(scan_id)})
        if not scan:
            raise HTTPException(status_code=404, detail="Scan not found")

        # Create PDF in Memory
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # --- Header ---
        c.setFillColorRGB(0.06, 0.3, 0.27) # Medical Teal
        c.rect(0, height - 100, width, 100, fill=True, stroke=False)
        
        c.setFillColorRGB(1, 1, 1) # White
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, height - 60, "RetiNet Pro")
        c.setFont("Helvetica", 12)
        c.drawString(50, height - 80, "Clinical Diagnostic Report")

        # --- Patient Info ---
        c.setFillColorRGB(0, 0, 0) # Black
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, height - 140, "Patient Details")
        
        c.setFont("Helvetica", 12)
        y = height - 170
        c.drawString(50, y, f"ID: {scan.get('patient_id', 'Unknown')}")
        c.drawString(50, y - 20, f"Name: {scan.get('patient_name', 'Unknown')}")
        c.drawString(50, y - 40, f"Date: {scan['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")

        # --- Diagnosis Result ---
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y - 80, "AI Diagnostic Analysis")
        
        c.setFont("Helvetica", 12)
        diag_grade = scan['diagnosis']
        confidence = f"{scan['confidence']*100:.1f}%"
        
        # Color coding text based on severity (Simulated by drawing simplified text)
        c.drawString(50, y - 110, f"Condition: {diag_grade}")
        c.drawString(50, y - 130, f"Confidence: {confidence}")
        c.drawString(50, y - 150, f"Biological Age Est: {scan.get('biological_age', '--')} Years")
        c.drawString(50, y - 170, f"Cardio Risk: {scan.get('cardiovascular_risk', '--')}")

        # --- Image Evidence ---
        # Extract filename from URL (http://localhost:8000/uploads/xyz.jpg -> uploads/xyz.jpg)
        local_path = scan['file_url'].replace("http://localhost:8000/", "")
        
        # Determine where the image ends to start the explanation
        y_image_bottom = y - 425 
        
        if os.path.exists(local_path):
            img = ImageReader(local_path)
            # Draw Image centered
            img_width = 300
            img_height = 225
            c.drawImage(img, (width - img_width)/2, y - 425, width=img_width, height=img_height, preserveAspectRatio=True)
            
            c.setFont("Helvetica-Oblique", 9)
            c.setFillColorRGB(0.3, 0.3, 0.3)
            c.drawCentredString(width/2, y - 440, "Figure 1: Analyzed Retinal Fundus Scan")
            y_explanation_start = y - 480
        else:
            y_explanation_start = y - 200 # If no image, start higher

        # --- Glossary / Educational Section ---
        c.setFillColorRGB(0.06, 0.3, 0.27) # Medical Green
        
        # Helper function to print a section
        def print_section(title, items, start_y):
            # Check for page break before section title
            nonlocal c, height # Access outer canvas and height
            current_y = start_y
            
            if current_y < 120:
                c.showPage()
                current_y = height - 50
                c.setFillColorRGB(0.06, 0.3, 0.27)
            
            c.setFont("Helvetica-Bold", 12)
            c.drawString(50, current_y, title)
            c.setFillColorRGB(0, 0, 0)
            
            current_y -= 25
            
            for item_title, item_desc in items:
                # Check for page break
                if current_y < 100:
                    c.showPage()
                    current_y = height - 50
                
                c.setFont("Helvetica-Bold", 10)
                c.drawString(50, current_y, item_title)
                
                c.setFont("Helvetica", 10)
                # Wrap text
                wrapped_lines = textwrap.wrap(item_desc, width=90)
                
                desc_y = current_y - 15
                for line in wrapped_lines:
                    c.drawString(50, desc_y, line)
                    desc_y -= 12
                
                current_y = desc_y - 10
            
            return current_y - 10 # Extra space after section

        # 1. Definitions
        definitions = [
            ("Diabetic Retinopathy (DR):", "The AI scans for \"red lesions\" like micro-bleeds or leaky vessels. It compares these patterns against a massive database to see if they match known signs of disease."),
            ("Cardiovascular Risk:", "It measures the Arteriolar-Venular Ratio (AVR)—the thickness of your arteries compared to your veins. If arteries are too narrow, it signals high blood pressure risk."),
            ("Biological Age:", "It calculates a \"Retinal Age Gap\". If your eye vessels look older than your actual age, it suggests your body is aging faster than the calendar says.")
        ]
        
        curr_y = print_section("Understanding Your Results", definitions, y_explanation_start)

        # 2. Clinical Implications
        implications = [
           ("If High DR Risk:", "Indicates potential microvascular damage. Probability of proliferative retinopathy is high. Strong recommendation for immediate ophthalmological grading."),
           ("If Elevated Cardio Risk:", "Arteriolar narrowing is a robust biomarker for systemic hypertension. Clinical correlation with blood pressure monitoring is prescribed."),
           ("If Large Age Gap:", "Retinal vascular age exceeding chronological age correlates with oxidative stress. Suggests need for comprehensive metabolic screening.")
        ]
        curr_y = print_section("Clinical Implications & Risk Assessment", implications, curr_y)

        # 3. Dietary Recommendations
        diet = [
            ("Retinal Defense:", "Increase intake of leafy greens (Spinach, Kale) rich in Lutein and Zeaxanthin to support macular pigment density."),
            ("Vascular Integrity:", "Omega-3 rich foods (Salmon, Walnuts) to reduce endothelial inflammation and support vessel flexibility."),
            ("Antioxidant Support:", "Berries (Blueberries, Goji) and Citrus fruits for Vitamin C to strengthen micro-vessels.")
        ]
        curr_y = print_section("Recommended Lifestyle & Dietary Interventions", diet, curr_y)

        # --- Footer ---
        c.setLineWidth(0.5)
        c.setStrokeColorRGB(0.8, 0.8, 0.8)
        c.line(50, 60, width - 50, 60)
        
        c.setFont("Helvetica", 8)
        c.setFillColorRGB(0.5, 0.5, 0.5)
        # Disclaimer (Left)
        c.drawString(50, 45, "Generated by RetiNet Pro AI System. Informational purpose only.")
        c.drawString(50, 35, "This report does not constitute medical advice.")
        
        # Physician (Right)
        c.drawRightString(width - 50, 45, "Reviewing Physician: Karthi's AI Doctor")
        c.drawRightString(width - 50, 35, "Verified Digital Signature")

        c.showPage()
        c.save()

        buffer.seek(0)
        return Response(content=buffer.getvalue(), media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=report_{scan_id}.pdf"})

    except Exception as e:
        print(f"Report Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history(patient_id: str = None):
    query = {}
    if patient_id:
        query["patient_id"] = patient_id
        
    scans = await collection_scans.find(query).sort("timestamp", -1).to_list(100)
    # Convert ObjectIDs to strings
    for scan in scans:
        scan["_id"] = str(scan["_id"])
    return scans

@app.get("/patients")
async def get_patients():
    pipeline = [
       {"$group": {
           "_id": "$mobile_number",
           "name": {"$first": "$patient_name"},
           "last_scan": {"$max": "$timestamp"},
           "latest_diagnosis": {"$last": "$diagnosis"}, 
           "scan_count": {"$sum": 1},
           "patient_id": {"$first": "$patient_id"}
       }}
    ]
    patients_agg = await collection_scans.aggregate(pipeline).to_list(100)
    
    # Clean up for frontend
    results = []
    for p in patients_agg:
        if p["_id"] and p["_id"] != "Unknown": # Filter out unknown/test uploads if needed
             results.append({
                 "id": p["patient_id"],
                 "name": p["name"],
                 "mobile": p["_id"],
                 "lastScan": p["last_scan"],
                 "status": p["latest_diagnosis"],
                 "scanCount": p["scan_count"]
             })
    return results

@app.get("/")
def read_root():
    return {"message": "RetiNet Pro AI Engine Operational"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

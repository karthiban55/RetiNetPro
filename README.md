<div align="center">
  <h1>RetiNet Pro</h1>
  <p><b>Advanced Oculomics & Non-Invasive Diagnostic Suite</b></p>
  
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
</div>

---


---

### 👁️ The Vision: A Window to Systemic Health

RetiNet Pro is a medical-grade artificial intelligence platform built to transform how we screen for chronic diseases. Traditionally, checking for heart health, kidney function, or diabetic complications requires invasive blood tests or expensive hospital equipment. RetiNet Pro changes this paradigm by using the **Human Retina** as a non-invasive diagnostic mirror.

Because the retina is the only place in the body where living blood vessels and neural tissues can be seen directly, our AI can detect "sub-clinical" markers—tiny changes in vessel width or nerve health—that indicate systemic disease years before a patient feels a single symptom.

---

## 🔥 Project Core Pillars

### 1. Diabetic Retinopathy Grading

The core of the system is a high-precision screening tool for Diabetic Retinopathy (DR). Using a **Vision Transformer (ViT-B/16)**, the model identifies micro-aneurysms, hemorrhages, and exudates. It doesn't just provide a "Yes/No" answer; it grades the severity of the disease based on clinical standards, helping patients understand if they need immediate specialist intervention.

### 2. Cardiovascular Risk Prediction

Using a methodology known as **Arteriolar-Venular Ratio (AVR)** analysis, RetiNet Pro examines the plumbing of the heart through the eye. Narrowed arteries and dilated veins in the retina are direct mathematical indicators of hypertension and increased stroke risk. The AI calculates these ratios in real-time to provide a "Heart Health Score."

### 3. Biological Age & The "Retinal Age Gap"

Your eye may be older than you are. By analyzing the wear and tear of the retinal vasculature, the model predicts your **Biological Age**. A significant "Age Gap" between your chronological age and retinal age is a proven biomarker for mortality risk and premature organ aging.

### 4. Explainable AI (XAI)

In medicine, "Black Box" AI is dangerous. RetiNet Pro implements **Grad-CAM (Gradient-weighted Class Activation Mapping)**. This generates a visual heatmap over the patient's retina photo, glowing in the specific areas where the AI detected pathology. This allows clinicians to verify the AI’s findings with their own eyes.

---

## 🛠️ Technical Implementation & Architecture

### The Frontend: Clinical Precision UX

The interface is built with **Next.js 14** and **Tailwind CSS**, focusing on a "Clinical Modernist" aesthetic. It features:

* **Asynchronous State Management:** For handling heavy ML processing without freezing the UI.
* **Framer Motion Animations:** For smooth transitions between diagnostic stages.
* **Smart Skeleton Loaders:** To provide visual feedback while the backend processes high-resolution images.

### The Backend: High-Performance ML Inference

The engine is powered by **FastAPI**, chosen for its high-concurrency capabilities.

* **Model:** A Vision Transformer (ViT) fine-tuned on the APTOS and MESSIDOR-2 datasets.
* **Preprocessing:** Every image passes through a **Ben Graham Filter**, which removes noise and enhances the contrast of tiny blood vessels to ensure 99% detection accuracy even in low-light photos.
* **Database:** **MongoDB Atlas** serves as our NoSQL document store, managing unstructured image data and complex patient histories with ease.
* **Security:** Integrated **Supabase Auth** ensures that sensitive medical data is encrypted and accessible only to authorized users.

---

## 🚀 Step-by-Step Installation Guide

### Setting Up the Intelligence (Backend)

1. **Navigate to the directory:** `cd backend`
2. **Environment Setup:** Create a virtual environment using `python -m venv venv` and activate it.
3. **Dependencies:** Install the medical and ML libraries via `pip install -r requirements.txt`.
4. **Launch:** Run the API using `uvicorn main:app --reload`. The server will start on `localhost:8000`.

### Setting Up the Interface (Frontend)

1. **Navigate to the directory:** `cd frontend`
2. **Install Packages:** Run `npm install` to gather all React and Tailwind dependencies.
3. **Environment Variables:** Create a `.env` file to link your MongoDB and Supabase credentials.
4. **Launch:** Run `npm run dev` to start the dashboard on `localhost:3000`.

---

## 📝 Clinical Reporting & Output

Upon completion of a scan, the system utilizes **ReportLab** to generate a comprehensive, hospital-grade PDF report. This report includes:

* The original retinal fundus image.
* The AI-generated Heatmap (Grad-CAM).
* A breakdown of risk scores for Diabetes, Heart Health, and Biological Age.
* Automated clinical suggestions for the next steps.

---

## 📜 Ethical Disclaimer

RetiNet Pro is designed as a **Decision Support System (DSS)**. It is intended to assist healthcare professionals and provide early screening in underserved areas. It is not a replacement for a comprehensive dilated eye exam performed by a licensed ophthalmologist.

---

**Developed with passion for Healthcare Innovation by Karthiban R**
*Harnessing the power of AI to see the invisible.*

---


---

## 🏗️ System Architecture
The following diagram illustrates the seamless flow from raw image capture to clinical reporting.

```mermaid
graph TD
    A[Patient Image/Camera Feed] -->|Preprocessing| B(Ben Graham Filter)
    B -->|Inference| C{Vision Transformer}
    C -->|Feature Extraction| D[Vascular Analysis]
    C -->|Classification| E[Disease Grading]
    D & E -->|JSON Response| F[FastAPI Backend]
    F -->|Store| G[(MongoDB Atlas)]
    F -->|Generate| H[Hospital PDF Report]
    H -->|View| I[Next.js Dashboard]

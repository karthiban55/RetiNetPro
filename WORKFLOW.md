# RetiNet Pro - Operational Workflow

## 1. Start the Application
**Terminal 1: Frontend**
```powershell
cd frontend_vite
npm run dev
```
> UI accessible at: http://localhost:5173

**Terminal 2: Backend**
```powershell
cd backend
venv\Scripts\uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
> API accessible at: http://localhost:8000

## 2. Train the AI Model
Prerequisites: Ensure `backend/data/raw/` contains `train.csv` and `train_images/`.

**Step A: Prepare Data** (Only one time)
```powershell
cd backend
venv\Scripts\python ml/prepare_dataset.py
```

**Step B: Run Training**
```powershell
cd backend
venv\Scripts\python ml/train.py
```
> This will save the model to `backend/ml/models/retinet_v1.pth`.
> The backend will automatically detect and load this file.

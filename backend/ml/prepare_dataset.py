import os
import shutil
import pandas as pd
from datasets import load_dataset
import uuid
from sklearn.model_selection import train_test_split
from torchvision import transforms
from PIL import Image
from tqdm import tqdm

# Config
DATA_DIR = "data/raw"
PROCESSED_DIR = "../data/processed"
IMG_SIZE = 224

def prepare_data():
    """
    Organizes APTOS/RFMiD dataset into a standard structure for PyTorch.
    Expected Raw Structure:
    backend/data/raw/
        ├── train_images/
        │   ├── 000c1434d8d7.png
        │   └── ...
        └── train.csv (Must contain 'id_code' and 'diagnosis')
    """
    print("🚀 Starting Data Preprocessing...")
    
    print("🚀 Starting Data Preprocessing (Powered by Hugging Face)...")
    
    # 1. Download from Hugging Face
    dataset_name = "karthiban55/RetiNetPro-Dataset"
    print(f"📥 Downloading dataset: {dataset_name}...")
    
    try:
        # Load dataset (this automatically handles caching)
        dataset = load_dataset(dataset_name)
        print("✅ Dataset downloaded successfully!")
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        return

    # 2. Create processed directories
    for split in ['train', 'val']:
        for i in range(5): # 5 Classes (0-4) for DR
            os.makedirs(os.path.join(PROCESSED_DIR, split, str(i)), exist_ok=True)

    # 3. Process and Save
    # The dataset from ImageFolder/HF usually has 'image' (PIL) and 'label' columns
    # We need to respect the split if it exists, or create one.
    
    # Using 'train' split from HF for everything, then splitting manually if needed
    # Or if HF repo has train/test splits, use those. 
    # For a simple image folder upload, it usually loads as 'train'.
    
    full_dataset = dataset['train']
    
    # Convert HF dataset to Pandas for easy splitting (or use HF split)
    # But to keep logic similar to before, let's extract metadata
    
    # However, HF datasets are best used directly. 
    # But since train.py expects a specific folder structure, we will "hydrate" that structure
    # from the HF dataset. This allows train.py to remain largely unchanged for now.
    
    print("🔄 Organizing data into local folders...")
    
    # Helper to save image
    def save_hf_image(example, split_name):
        image = example['image']
        label = example['label']
        if 'id_code' in example:
             filename = f"{example['id_code']}.png"
        else:
             # Fallback if no ID
             filename = f"{uuid.uuid4()}.png"
             
        dst_path = os.path.join(PROCESSED_DIR, split_name, str(label), filename)
        
        if not os.path.exists(dst_path): # Avoid re-writing if exists
             image = image.resize((IMG_SIZE, IMG_SIZE))
             image.save(dst_path)
             
    # Split 80/20
    header_dataset = full_dataset.train_test_split(test_size=0.2, seed=42, stratify_by_column="label")
    train_ds = header_dataset['train']
    val_ds = header_dataset['test']
    
    for example in tqdm(train_ds, desc="Processing Train"):
         save_hf_image(example, 'train')
         
    for example in tqdm(val_ds, desc="Processing Val"):
         save_hf_image(example, 'val')

    print("🎉 Data preparation complete! Ready for training.")

if __name__ == "__main__":
    prepare_data()

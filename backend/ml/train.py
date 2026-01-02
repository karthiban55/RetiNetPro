import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
import timm
import copy
import os
from tqdm import tqdm

# Config
DATA_DIR = "../data/processed"
MODEL_SAVE_PATH = "ml/models/retinet_v1.pth"
BATCH_SIZE = 32
EPOCHS = 10
LR = 0.001

def train_model():
    print("🚀 Initializing RetiNet Training Sequence...")
    
    # 1. Device Config
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"✅ Using Device: {device}")

    # 2. Data Transforms (Augmentation)
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    # 3. Load Data
    if not os.path.exists(DATA_DIR):
        print("❌ Processed data not found. Run 'prepare_dataset.py' first.")
        return

    image_datasets = {x: datasets.ImageFolder(os.path.join(DATA_DIR, x), data_transforms[x]) for x in ['train', 'val']}
    dataloaders = {x: torch.utils.data.DataLoader(image_datasets[x], batch_size=BATCH_SIZE, shuffle=True, num_workers=4) for x in ['train', 'val']}
    dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'val']}

    # 4. Initialize Model (ResNet18 for Speed, can switch to ViT)
    model = timm.create_model('resnet18', pretrained=True, num_classes=5) # 5 Classes for DR
    model = model.to(device)

    # 5. Loss & Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)
    
    # 6. Training Loop
    best_acc = 0.0

    for epoch in range(EPOCHS):
        print(f"\nEpoch {epoch+1}/{EPOCHS}")
        print("-" * 10)

        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data
            for inputs, labels in tqdm(dataloaders[phase], desc=f"{phase} loop"):
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)
            
            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects.double() / dataset_sizes[phase]

            print(f"{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")

            # Save Deep Save
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                os.makedirs("ml/models", exist_ok=True)
                torch.save(model.state_dict(), MODEL_SAVE_PATH)
                print("💾 Model Saved!")

    print(f"\n🎉 Training Complete. Best Val Acc: {best_acc:.4f}")

if __name__ == "__main__":
    train_model()

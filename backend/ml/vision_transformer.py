import torch
import torch.nn as nn
import timm

class RetiNetModel(nn.Module):
    def __init__(self, model_name="vit_base_patch16_224", num_classes_dr=5, num_classes_disease=45):
        super(RetiNetModel, self).__init__()
        # Load Pretrained Vision Transformer
        self.backbone = timm.create_model(model_name, pretrained=True, num_classes=0) # Remove classification head
        
        # Input features size (768 for ViT-Base)
        self.num_features = self.backbone.num_features
        
        # Multi-Task Heads
        
        # 1. Diabetic Retinopathy (Classification: 0-4)
        self.head_dr = nn.Sequential(
            nn.Linear(self.num_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes_dr)
        )
        
        # 2. Disease Classification (Multi-Label: 45 classes)
        self.head_disease = nn.Sequential(
            nn.Linear(self.num_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes_disease)
        )
        
        # 3. Biological Age (Regression)
        self.head_age = nn.Sequential(
            nn.Linear(self.num_features, 256),
            nn.ReLU(),
            nn.Linear(256, 1) # Single output: Age
        )
        
        # 4. Cardiovascular Risk (Regression: 0.0 - 1.0)
        self.head_risk = nn.Sequential(
            nn.Linear(self.num_features, 256),
            nn.ReLU(),
            nn.Linear(256, 1)
        )

    def forward(self, x):
        features = self.backbone(x)
        
        dr_out = self.head_dr(features)
        disease_out = self.head_disease(features)
        age_out = self.head_age(features)
        risk_out = self.head_risk(features)
        
        return {
            "dr_grade": dr_out,
            "diseases": disease_out,
            "biological_age": age_out,
            "cardio_risk": risk_out
        }

if __name__ == "__main__":
    # Test Instantiation
    model = RetiNetModel()
    dummy_input = torch.randn(1, 3, 224, 224)
    output = model(dummy_input)
    print("Model Output Keys:", output.keys())
    print("Sucessfully instantiated RetiNet ViT Backbone")

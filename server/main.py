from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from starlette.middleware.cors import CORSMiddleware as CORSMiddleware  # noqafrom PIL import Image
import numpy as np
import pandas as pd
import pickle
import io
from sklearn.preprocessing import StandardScaler
from fastapi.responses import JSONResponse
from torchvision import transforms, models
import joblib
import os
from PIL import Image
app = FastAPI()
origins = [
    "http://localhost:5173",  # React development server
    # Add any other origins that should be allowed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
models_folder = os.path.join(os.path.dirname(__file__), "weights")

# # Load the model  #diamond_cnn.pth
# class DiamondCNN(nn.Module):
#     def __init__(self):
#         super(DiamondCNN, self).__init__()
#         self.conv1 = nn.Conv2d(3, 16, kernel_size=3, stride=1, padding=1)
#         self.bn1 = nn.BatchNorm2d(16)
#         self.conv2 = nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1)
#         self.bn2 = nn.BatchNorm2d(32)
#         self.conv3 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
#         self.bn3 = nn.BatchNorm2d(64)
#         self.pool = nn.MaxPool2d(kernel_size=2, stride=2, padding=0)
#         self.fc1 = nn.Linear(64 * 28 * 28, 512)
#         self.dropout1 = nn.Dropout(0.5)
#         self.fc2 = nn.Linear(512, 256)
#         self.dropout2 = nn.Dropout(0.5)
#         self.fc3 = nn.Linear(256, 8)  # 8 output features

#     def forward(self, x):
#         x = self.pool(F.relu(self.bn1(self.conv1(x))))
#         x = self.pool(F.relu(self.bn2(self.conv2(x))))
#         x = self.pool(F.relu(self.bn3(self.conv3(x))))
#         x = x.view(-1, 64 * 28 * 28)
#         x = F.relu(self.fc1(x))
#         x = self.dropout1(x)
#         x = F.relu(self.fc2(x))
#         x = self.dropout2(x)
#         x = self.fc3(x)
#         return x


### CNN MULTILABEL MODEL
# class DiamondCNN(nn.Module):
#     def __init__(self):
#         super(DiamondCNN, self).__init__()
#         self.conv1 = nn.Conv2d(3, 16, kernel_size=3, stride=1, padding=1)
#         self.bn1 = nn.BatchNorm2d(16)
#         self.conv2 = nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1)
#         self.bn2 = nn.BatchNorm2d(32)
#         self.conv3 = nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1)
#         self.bn3 = nn.BatchNorm2d(64)
#         self.pool = nn.MaxPool2d(kernel_size=2, stride=2, padding=0)
#         self.fc1 = nn.Linear(64 * 28 * 28, 512)
#         self.dropout1 = nn.Dropout(0.5)
#         self.fc2 = nn.Linear(512, 256)
#         self.dropout2 = nn.Dropout(0.5)
#         self.fc3 = nn.Linear(256, 8)  # 8 output features

#     def forward(self, x):
#         x = self.pool(F.relu(self.bn1(self.conv1(x))))
#         x = self.pool(F.relu(self.bn2(self.conv2(x))))
#         x = self.pool(F.relu(self.bn3(self.conv3(x))))
#         x = x.view(-1, 64 * 28 * 28)
#         x = F.relu(self.fc1(x))
#         x = self.dropout1(x)
#         x = F.relu(self.fc2(x))
#         x = self.dropout2(x)
#         x = self.fc3(x)
#         return x
    
# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# cnn_model = DiamondCNN().to(device)
# cnn_model.load_state_dict(torch.load('diamond_cnn_01.pth'))
# cnn_model.eval()

# # Load the label encoders
# with open('label_encoders.pkl', 'rb') as f:
#     label_encoders = pickle.load(f)

# # Preprocess the input image
# transform = transforms.Compose([
#     transforms.Resize((224, 224)),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
# ])

# class InferenceRequest(BaseModel):
#     image: bytes

# @app.post("/predict-cnn/")
# async def predict(file: UploadFile = File(...)):
#     image = Image.open(io.BytesIO(await file.read())).convert("RGB")
#     image = transform(image).unsqueeze(0).to(device)

#     with torch.no_grad():
#         outputs = cnn_model(image)
#         outputs = outputs.cpu().numpy().flatten()

#     # Clamp the categorical outputs to the valid range
#     shape_index = np.clip(int(outputs[0]), 0, len(label_encoders['shape'].classes_) - 1)
#     clarity_index = np.clip(int(outputs[2]), 0, len(label_encoders['clarity'].classes_) - 1)
#     colour_index = np.clip(int(outputs[3]), 0, len(label_encoders['colour'].classes_) - 1)
#     cut_index = np.clip(int(outputs[4]), 0, len(label_encoders['cut'].classes_) - 1)
#     polish_index = np.clip(int(outputs[5]), 0, len(label_encoders['polish'].classes_) - 1)
#     symmetry_index = np.clip(int(outputs[6]), 0, len(label_encoders['symmetry'].classes_) - 1)
#     fluorescence_index = np.clip(int(outputs[7]), 0, len(label_encoders['fluorescence'].classes_) - 1)

#     # Decode the labels
#     decoded_output = {
#         'shape': label_encoders['shape'].inverse_transform([shape_index])[0],
#         'carat': float(outputs[1]),
#         'clarity': label_encoders['clarity'].inverse_transform([clarity_index])[0],
#         'colour': label_encoders['colour'].inverse_transform([colour_index])[0],
#         'cut': label_encoders['cut'].inverse_transform([cut_index])[0],
#         'polish': label_encoders['polish'].inverse_transform([polish_index])[0],
#         'symmetry': label_encoders['symmetry'].inverse_transform([symmetry_index])[0],
#         'fluorescence': label_encoders['fluorescence'].inverse_transform([fluorescence_index])[0]
#     }

#     # Ensure all values are Python native types
#     for key, value in decoded_output.items():
#         if isinstance(value, np.generic):
#             decoded_output[key] = value.item()

#     return decoded_output

## PRICE PREDICTION
class DiamondFeatures(BaseModel):
    carat: float
    cut: str
    color: str
    clarity: str
    x: float
    y: float
    z: float

class Net(nn.Module):
    def __init__(self, input_size, num_classes):
        super(Net, self).__init__()
        self.fc11 = nn.Linear(input_size, 90)
        self.fc12 = nn.Linear(90, 30)
        self.fc13 = nn.Linear(30, 15)
        self.fc21 = nn.Linear(input_size, 90)
        self.fc22 = nn.Linear(90, 30)
        self.fc23 = nn.Linear(30, 15)
        self.fc3 = nn.Linear(30, num_classes)
        self.bn1 = nn.BatchNorm1d(90)
        self.bn2 = nn.BatchNorm1d(30)
        self.bn3 = nn.BatchNorm1d(15)
        
    def forward(self, x):
        x1 = F.relu(self.bn1(self.fc11(x)))
        x1 = F.relu(self.bn2(self.fc12(x1)))
        x1 = F.relu(self.bn3(self.fc13(x1)))
        
        x2 = F.softplus(self.bn1(self.fc21(x)))
        x2 = F.softplus(self.bn2(self.fc22(x2)))
        x2 = F.softplus(self.bn3(self.fc23(x2)))
        
        x = F.relu(self.fc3(torch.cat([x1, x2], dim=1)))
        return x

# Load the trained model

input_size = 25 
num_classes = 1
mlp_model = Net(input_size, num_classes)
mlp_model.load_state_dict(torch.load(os.path.join(models_folder, 'diamond_price_prediction_model.pth')))
mlp_model.eval()

@app.post("/predict-price/")
def predict(features: DiamondFeatures):
    # Convert input data to DataFrame
    data = features.dict()
    df = pd.DataFrame([data])
    
    # Preprocess the data
    categorical = ['cut', 'color', 'clarity']
    df = pd.get_dummies(df, columns=categorical)

    column_names = ['carat', 'x', 'y', 'z', 
                    'cut_Fair', 'cut_Good', 'cut_Ideal', 'cut_Premium', 'cut_Very Good',
                    'color_D', 'color_E', 'color_F', 'color_G', 'color_H', 'color_I', 'color_J',
                    'clarity_I1', 'clarity_IF', 'clarity_SI1', 'clarity_SI2', 'clarity_VS1',
                    'clarity_VS2', 'clarity_VVS1', 'clarity_VVS2', 'xyz']
    for col in column_names:
        if col not in df.columns:
            df[col] = 0 
            
    df['xyz'] = df['x'] * df['y'] * df['z']
    df = df[column_names]
    # Scale numerical features
    scale_feats = [col for col in df.columns if df[col].dtype == 'float64']
    scaler = StandardScaler()
    df_scaled = df.copy()
    df_scaled[scale_feats] = scaler.fit_transform(df[scale_feats])
    df = df.astype(np.float32)
    input_tensor = torch.tensor(df.values, dtype=torch.float32)

    # Make prediction
    with torch.no_grad():
        prediction = mlp_model(input_tensor)
        predicted_price = prediction.item() / 10
    
    return {"predicted_price": predicted_price}

# Load the RANDOMFORESTREGRESSOR model
# mlp_model = joblib.load(os.path.join(models_folder,'diamond_price_prediction_model.pkl'))

# # Define request body structure using Pydantic BaseModel
# class DiamondPricePredictionInput(BaseModel):
#     carat: float
#     cut: str
#     color: str
#     clarity: str
#     x: float
#     y: float
#     z: float

# # Define prediction endpoint
# @app.post("/predict-price/")
# def predict_price(input_data: DiamondPricePredictionInput):
    # Prepare input data as a DataFrame
    df_sample = pd.DataFrame([input_data.dict()])

    # Map categorical data to numeric as done in preprocessing
    cut_map = {'Fair':0, 'Good':1, 'Very Good':2, 'Premium':3, 'Ideal':4}
    color_map = {'J':0, 'I':1, 'H':2, 'G':3, 'F':4, 'E':5, 'D':6}
    clarity_map = {'I1':0, 'SI2':1, 'SI1':2, 'VS2':3, 'VS1':4, 'VVS2':5, 'VVS1':6, 'IF':7}

    df_sample['cut'] = df_sample['cut'].map(cut_map)
    df_sample['color'] = df_sample['color'].map(color_map)
    df_sample['clarity'] = df_sample['clarity'].map(clarity_map)

    # Select relevant features for prediction
    X_sample = df_sample[['carat', 'cut', 'color', 'clarity', 'x', 'y', 'z']]

    # Predict using the loaded model
    prediction = mlp_model.predict(X_sample)

    return {"predicted_price": prediction[0]}



### RESNET FINETUNED MODELS
models_paths = {
  'shape': os.path.join(models_folder, 'diamond_cnn_shape.pth'),
  'cut': os.path.join(models_folder, 'diamond_cnn_cut.pth'),
  'color': os.path.join(models_folder, 'diamond_cnn_color.pth'),
  'clarity': os.path.join(models_folder, 'diamond_cnn_clarity.pth'),
  'polish': os.path.join(models_folder, 'diamond_cnn_polish.pth'),
  'symmetry': os.path.join(models_folder, 'diamond_cnn_symmetry.pth'),
  'fluorescence': os.path.join(models_folder, 'diamond_cnn_fluorescence.pth')
}
loaded_models = {}
for feature, path in models_paths.items():
    model = models.resnet50(pretrained=False)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, len(joblib.load(os.path.join(models_folder, f'label_encoder_{feature}.pkl')).classes_))
    model.load_state_dict(torch.load(path, map_location=torch.device('cpu')))
    model.eval()
    loaded_models[feature] = model


label_encoders = {
  'shape': joblib.load(os.path.join(models_folder, 'label_encoder_shape.pkl')),
  'cut': joblib.load(os.path.join(models_folder, 'label_encoder_cut.pkl')),
  'color': joblib.load(os.path.join(models_folder, 'label_encoder_color.pkl')),  # Note the spelling correction
  'clarity': joblib.load(os.path.join(models_folder, 'label_encoder_clarity.pkl')),
  'polish': joblib.load(os.path.join(models_folder, 'label_encoder_polish.pkl')),
  'symmetry': joblib.load(os.path.join(models_folder, 'label_encoder_symmetry.pkl')),
  'fluorescence': joblib.load(os.path.join(models_folder, 'label_encoder_fluorescence.pkl'))
}

# Preprocess image
def preprocess_image(image):
    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    image = Image.open(io.BytesIO(image)).convert('RGB')
    image = data_transforms(image)
    image = image.unsqueeze(0)  # Add batch dimension
    return image


# Predict function
def predict(image):
    image = preprocess_image(image)
    predictions = {}
    for feature, model in loaded_models.items():
        outputs = model(image)
        _, preds = torch.max(outputs, 1)
        label = label_encoders[feature].inverse_transform(preds.cpu().numpy())[0]
        predictions[feature] = label
    return predictions

@app.post("/predict-features/")
async def predict_diamond(file: UploadFile = File(...)):
    image = await file.read()
    predictions = predict(image)
    return JSONResponse(content=predictions)






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

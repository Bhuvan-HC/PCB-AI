import os
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import joblib


# --------------------------------------------------
# 1. Paths
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATA_FILE = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "lm7805_processed.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models",
    "trained"
)

os.makedirs(MODEL_DIR, exist_ok=True)


# --------------------------------------------------
# 2. Load dataset
# --------------------------------------------------

print("Loading dataset...")

df = pd.read_csv(DATA_FILE)

print("Dataset shape:", df.shape)


# --------------------------------------------------
# 3. Select features
# --------------------------------------------------

features = [
    "input_voltage",
    "output_voltage",
    "current",
    "temperature_1",
    "temperature_2",
    "tp1_voltage",
    "tp2_voltage",
    "tp3_voltage",
    "continuity"
]

X = df[features]
y = df["fault_label"]


# --------------------------------------------------
# 4. Train/test split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# 5. Feature scaling
# --------------------------------------------------

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


# --------------------------------------------------
# 6. Create Random Forest model
# --------------------------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)


# --------------------------------------------------
# 7. Train
# --------------------------------------------------

print("\nTraining Random Forest...")

model.fit(
    X_train_scaled,
    y_train
)

print("Training completed.")


# --------------------------------------------------
# 8. Prediction
# --------------------------------------------------

y_pred = model.predict(X_test_scaled)


# --------------------------------------------------
# 9. Evaluation
# --------------------------------------------------

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\n==============================")
print("MODEL RESULTS")
print("==============================")

print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred
    )
)

print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# --------------------------------------------------
# 10. Save model
# --------------------------------------------------

model_file = os.path.join(
    MODEL_DIR,
    "lm7805_fault_model.pkl"
)

scaler_file = os.path.join(
    MODEL_DIR,
    "feature_scaler.pkl"
)

joblib.dump(
    model,
    model_file
)

joblib.dump(
    scaler,
    scaler_file
)

print("\n==============================")
print("MODEL SAVED")
print("==============================")

print("Model:")
print(model_file)

print("\nScaler:")
print(scaler_file)
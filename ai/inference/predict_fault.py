import os
import pandas as pd
import joblib


# --------------------------------------------------
# 1. Paths
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models",
    "trained"
)

DATA_FILE = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "lm7805_processed.csv"
)

LABEL_FILE = os.path.join(
    BASE_DIR,
    "datasets",
    "processed",
    "fault_labels.csv"
)

MODEL_FILE = os.path.join(
    MODEL_DIR,
    "lm7805_fault_model.pkl"
)

SCALER_FILE = os.path.join(
    MODEL_DIR,
    "feature_scaler.pkl"
)


# --------------------------------------------------
# 2. Load model
# --------------------------------------------------

model = joblib.load(MODEL_FILE)
scaler = joblib.load(SCALER_FILE)

labels = pd.read_csv(LABEL_FILE)

label_map = dict(
    zip(
        labels["fault_label"],
        labels["fault_type"]
    )
)


# --------------------------------------------------
# 3. Load one test measurement
# --------------------------------------------------

df = pd.read_csv(DATA_FILE)

# Select one sample for demonstration
sample = df.iloc[[0]]

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

X = sample[features]

# Scale the measurement
X_scaled = scaler.transform(X)


# --------------------------------------------------
# 4. Predict fault
# --------------------------------------------------

prediction = model.predict(X_scaled)[0]

probabilities = model.predict_proba(X_scaled)[0]

fault_name = label_map[prediction]

confidence = max(probabilities) * 100


# --------------------------------------------------
# 5. Display diagnosis
# --------------------------------------------------

print("\n================================")
print("AI PCB FAULT DIAGNOSIS")
print("================================")

print("\nInput measurement:")

for feature in features:
    print(
        f"{feature}: {sample.iloc[0][feature]}"
    )

print("\n--------------------------------")

print(f"Predicted fault : {fault_name}")
print(f"Confidence      : {confidence:.2f}%")

print("--------------------------------")

print("\nAll class probabilities:")

for label, probability in zip(
    model.classes_,
    probabilities
):
    print(
        f"{label_map[label]:20s} "
        f"{probability * 100:.2f}%"
    )

print("\n================================")
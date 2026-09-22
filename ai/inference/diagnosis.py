import os
import pandas as pd
import joblib


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models",
    "trained"
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "datasets",
    "processed"
)

MODEL_FILE = os.path.join(
    MODEL_DIR,
    "lm7805_fault_model.pkl"
)

SCALER_FILE = os.path.join(
    MODEL_DIR,
    "feature_scaler.pkl"
)

LABEL_FILE = os.path.join(
    DATA_DIR,
    "fault_labels.csv"
)


# --------------------------------------------------
# Load AI model
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
# Fault information
# --------------------------------------------------

FAULT_INFO = {
    "healthy": {
        "component": "None",
        "location": "PCB operating normally",
        "health_score": 100
    },

    "open_resistor": {
        "component": "R1",
        "location": "Resistor section",
        "health_score": 35
    },

    "shorted_capacitor": {
        "component": "C1",
        "location": "Capacitor section",
        "health_score": 20
    },

    "faulty_diode": {
        "component": "D1",
        "location": "Diode section",
        "health_score": 45
    },

    "broken_track": {
        "component": "PCB_TRACK",
        "location": "PCB copper track",
        "health_score": 15
    },

    "wrong_resistor": {
        "component": "R1",
        "location": "Resistor section",
        "health_score": 55
    },

    "solder_bridge": {
        "component": "PCB_SECTION",
        "location": "Solder connection section",
        "health_score": 25
    }
}


# --------------------------------------------------
# Features
# --------------------------------------------------

FEATURES = [
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


# --------------------------------------------------
# Diagnosis function
# --------------------------------------------------

def diagnose(measurement):

    data = pd.DataFrame(
        [measurement]
    )

    X = data[FEATURES]

    X_scaled = scaler.transform(X)

    prediction = model.predict(X_scaled)[0]

    probabilities = model.predict_proba(
        X_scaled
    )[0]

    fault_name = label_map[prediction]

    confidence = max(probabilities) * 100

    info = FAULT_INFO.get(
        fault_name,
        {
            "component": "Unknown",
            "location": "Unknown",
            "health_score": 50
        }
    )

    result = {
        "fault_type": fault_name,
        "component": info["component"],
        "location": info["location"],
        "confidence": round(confidence, 2),
        "health_score": info["health_score"]
    }

    return result


# --------------------------------------------------
# Test diagnosis
# --------------------------------------------------

if __name__ == "__main__":

    # Example measurement
    measurement = {
        "input_voltage": 12.0,
        "output_voltage": 5.0,
        "current": 0.18,
        "temperature_1": 30.0,
        "temperature_2": 31.0,
        "tp1_voltage": 12.0,
        "tp2_voltage": 11.3,
        "tp3_voltage": 5.0,
        "continuity": 1
    }

    result = diagnose(measurement)

    print("\n================================")
    print("PCB AI DIAGNOSIS")
    print("================================")

    print(f"Fault       : {result['fault_type']}")
    print(f"Component   : {result['component']}")
    print(f"Location    : {result['location']}")
    print(f"Confidence  : {result['confidence']}%")
    print(f"Health Score: {result['health_score']}/100")

    print("================================")
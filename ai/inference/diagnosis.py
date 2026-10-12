from typing import Any
from pathlib import Path

import joblib
import pandas as pd


# ============================================================
# PATHS
# ============================================================

AI_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = AI_DIR / "models" / "trained"

LM7805_MODEL_PATH = MODEL_DIR / "lm7805_fault_model.pkl"
LM7805_SCALER_PATH = MODEL_DIR / "feature_scaler.pkl"

LM2596S_MODEL_PATH = MODEL_DIR / "lm2596s_fault_model.pkl"


# ============================================================
# FEATURES
# ============================================================

FEATURE_NAMES = [
    "input_voltage",
    "output_voltage",
    "current",
    "temperature_1",
    "temperature_2",
    "tp1_voltage",
    "tp2_voltage",
    "tp3_voltage",
    "continuity",
]


# ============================================================
# FAULT INFORMATION
# ============================================================

FAULT_INFO = {
    "healthy": {
        "component": "None",
        "location": "PCB operating normally",
        "health_score": 100,
    },
    "open_resistor": {
        "component": "R1",
        "location": "Resistor section",
        "health_score": 35,
    },
    "shorted_capacitor": {
        "component": "C1",
        "location": "Capacitor section",
        "health_score": 20,
    },
    "faulty_diode": {
        "component": "D1",
        "location": "Diode section",
        "health_score": 45,
    },
    "broken_track": {
        "component": "PCB_TRACK",
        "location": "PCB copper track",
        "health_score": 15,
    },
    "wrong_resistor": {
        "component": "R1",
        "location": "Resistor section",
        "health_score": 55,
    },
    "solder_bridge": {
        "component": "PCB_SECTION",
        "location": "Solder connection section",
        "health_score": 25,
    },
}


# ============================================================
# INPUT VALIDATION
# ============================================================

def _make_features(data: dict[str, Any]) -> pd.DataFrame:
    """Validate and arrange electrical measurements."""

    missing = [
        name for name in FEATURE_NAMES
        if name not in data
    ]

    if missing:
        raise ValueError(
            f"Missing required measurements: {missing}"
        )

    try:
        values = [float(data[name]) for name in FEATURE_NAMES]
    except (TypeError, ValueError) as exc:
        raise ValueError(
            "All electrical measurements must be numeric."
        ) from exc

    import math

    if not all(math.isfinite(value) for value in values):
        raise ValueError(
            "Electrical measurements must be finite numbers."
        )

    return pd.DataFrame(
        [values],
        columns=FEATURE_NAMES,
    )


# ============================================================
# LOAD LM7805 MODEL
# ============================================================

def _load_lm7805():
    if not LM7805_MODEL_PATH.exists():
        raise FileNotFoundError(
            f"LM7805 model not found: {LM7805_MODEL_PATH}"
        )

    if not LM7805_SCALER_PATH.exists():
        raise FileNotFoundError(
            f"LM7805 scaler not found: {LM7805_SCALER_PATH}"
        )

    model = joblib.load(LM7805_MODEL_PATH)
    scaler = joblib.load(LM7805_SCALER_PATH)

    return model, scaler


# ============================================================
# COMMON RESULT FORMAT
# ============================================================

def _build_result(
    fault_type: str,
    confidence: float,
    probabilities: dict[str, float],
    pcb_type: str,
) -> dict[str, Any]:

    fault_info = FAULT_INFO.get(
        fault_type,
        {
            "component": "Unknown",
            "location": "Unknown",
            "health_score": 0,
        },
    )

    if confidence >= 0.90:
        confidence_level = "High"
    elif confidence >= 0.70:
        confidence_level = "Medium"
    else:
        confidence_level = "Low"

    return {
        "pcb_type": pcb_type,
        "fault_type": fault_type,
        "component": fault_info["component"],
        "location": fault_info["location"],
        "confidence": round(confidence, 4),
        "confidence_percent": round(confidence * 100, 2),
        "confidence_level": confidence_level,
        "health_score": fault_info["health_score"],
        "class_probabilities": {
            name: round(probability, 4)
            for name, probability in probabilities.items()
        },
        "note": (
            "Experimental LM2596S prediction based on "
            "synthetic training data; hardware validation "
            "is still required."
            if pcb_type == "LM2596S"
            else "LM7805 model prediction; validate against "
                 "real hardware measurements."
        ),
    }


# ============================================================
# LM7805 DIAGNOSIS
# ============================================================

def diagnose(data: dict[str, Any]) -> dict[str, Any]:
    """Run diagnosis using the existing LM7805 model."""

    features = _make_features(data)
    model, scaler = _load_lm7805()

    scaled_features = scaler.transform(features)

    prediction = model.predict(scaled_features)[0]
    probabilities_array = model.predict_proba(scaled_features)[0]

    classes = list(model.classes_)

    probabilities = {
        str(class_name): float(probability)
        for class_name, probability in zip(
            classes,
            probabilities_array,
        )
    }

    fault_type = str(prediction)
    confidence = float(max(probabilities_array))

    return _build_result(
        fault_type=fault_type,
        confidence=confidence,
        probabilities=probabilities,
        pcb_type="LM7805",
    )


# ============================================================
# LM2596S DIAGNOSIS
# ============================================================

def diagnose_lm2596s(
    data: dict[str, Any],
) -> dict[str, Any]:
    """Run diagnosis using the trained LM2596S pipeline."""

    if not LM2596S_MODEL_PATH.exists():
        raise FileNotFoundError(
            f"LM2596S model not found: {LM2596S_MODEL_PATH}"
        )

    # The saved artifact contains the complete sklearn pipeline.
    # It already includes imputation and the Random Forest.
    artifact = joblib.load(LM2596S_MODEL_PATH)

    features = _make_features(data)

    if isinstance(artifact, dict):
        model = artifact["model"]
        expected_features = artifact.get(
            "features",
            FEATURE_NAMES,
        )

        if list(expected_features) != FEATURE_NAMES:
            raise ValueError(
                "The LM2596S model feature order does not match "
                "the diagnosis API."
            )
    else:
        # Supports a model saved directly instead of in a dictionary.
        model = artifact

    prediction = model.predict(features)[0]
    probabilities_array = model.predict_proba(features)[0]

    classes = list(model.classes_)

    probabilities = {
        str(class_name): float(probability)
        for class_name, probability in zip(
            classes,
            probabilities_array,
        )
    }

    fault_type = str(prediction)
    confidence = float(max(probabilities_array))

    return _build_result(
        fault_type=fault_type,
        confidence=confidence,
        probabilities=probabilities,
        pcb_type="LM2596S",
    )
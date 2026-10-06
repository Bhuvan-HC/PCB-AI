from typing import Any
from numbers import Integral, Real


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


NUMERIC_CLASS_MAP = {
    0: "broken_track",
    1: "faulty_diode",
    2: "healthy",
    3: "open_resistor",
    4: "shorted_capacitor",
    5: "solder_bridge",
    6: "wrong_resistor",
}


def _load_model():
    from pathlib import Path
    import joblib

    ai_dir = Path(__file__).resolve().parent.parent

    model_path = (
        ai_dir
        / "models"
        / "trained"
        / "lm7805_fault_model.pkl"
    )

    scaler_path = (
        ai_dir
        / "models"
        / "trained"
        / "feature_scaler.pkl"
    )

    if not model_path.exists():
        raise FileNotFoundError(
            f"Fault model not found: {model_path}"
        )

    if not scaler_path.exists():
        raise FileNotFoundError(
            f"Feature scaler not found: {scaler_path}"
        )

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    return model, scaler


def _convert_class_name(class_name: Any) -> str:
    """
    Convert the trained model class into the
    corresponding fault name.

    Handles:
    - Python int
    - NumPy integer
    - Python float
    - NumPy floating-point values
    - String class names
    """

    if isinstance(class_name, str):
        if class_name in FAULT_INFO:
            return class_name

        try:
            numeric_class = int(float(class_name))

            return NUMERIC_CLASS_MAP.get(
                numeric_class,
                class_name,
            )

        except ValueError:
            return class_name

    if isinstance(class_name, Integral):
        numeric_class = int(class_name)

        return NUMERIC_CLASS_MAP.get(
            numeric_class,
            str(numeric_class),
        )

    if isinstance(class_name, Real):
        numeric_class = int(class_name)

        return NUMERIC_CLASS_MAP.get(
            numeric_class,
            str(numeric_class),
        )

    return str(class_name)


def diagnose(data: dict[str, Any]) -> dict[str, Any]:
    import numpy as np

    model, scaler = _load_model()

    feature_names = [
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

    features = np.array(
        [
            [
                float(data[name])
                for name in feature_names
            ]
        ],
        dtype=float,
    )

    scaled_features = scaler.transform(
        features
    )

    raw_prediction = model.predict(
        scaled_features
    )[0]

    probabilities = model.predict_proba(
        scaled_features
    )[0]

    class_names = list(model.classes_)

    probability_map = {}

    for class_name, probability in zip(
        class_names,
        probabilities,
    ):
        converted_name = _convert_class_name(
            class_name
        )

        probability_map[
            converted_name
        ] = float(probability)

    fault_type = _convert_class_name(
        raw_prediction
    )

    confidence = float(
        max(probabilities)
    )

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
        "fault_type": fault_type,
        "component": fault_info["component"],
        "location": fault_info["location"],
        "confidence": round(
            confidence,
            4,
        ),
        "confidence_percent": round(
            confidence * 100,
            2,
        ),
        "confidence_level": confidence_level,
        "health_score": fault_info["health_score"],
        "class_probabilities": {
            name: round(
                probability,
                4,
            )
            for name, probability
            in probability_map.items()
        },
    }
from pathlib import Path

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


# ============================================================
# PATHS
# ============================================================

# Script location: frontend/ai/training/train_lm2596s.py
# AI directory:    frontend/ai/
AI_DIR = Path(__file__).resolve().parent.parent

DATASET_PATH = (
    AI_DIR / "datasets" / "processed" / "lm2596s_processed.csv"
)

MODEL_DIR = AI_DIR / "models" / "trained"

MODEL_PATH = MODEL_DIR / "lm2596s_fault_model.pkl"


# ============================================================
# FEATURES
# ============================================================

FEATURES = [
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

TARGET = "fault_type"


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset():
    print("=" * 60)
    print("LM2596S FAULT-DIAGNOSIS MODEL TRAINING")
    print("=" * 60)

    print(f"\nDataset path: {DATASET_PATH}")

    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"\nDataset not found:\n{DATASET_PATH}\n"
            "Check that lm2596s_processed.csv exists in "
            "ai/datasets/processed/."
        )

    df = pd.read_csv(DATASET_PATH)

    print(f"\nDataset samples: {len(df)}")
    print(f"Dataset columns: {len(df.columns)}")

    required_columns = FEATURES + [TARGET]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}\n"
            f"Available columns: {df.columns.tolist()}"
        )

    # Convert measurement features to numeric values.
    X = df[FEATURES].apply(
        pd.to_numeric,
        errors="coerce",
    )

    # Fault labels must be present.
    y = df[TARGET].astype("string").str.strip()

    valid_labels = y.notna() & y.ne("")

    X = X.loc[valid_labels].copy()
    y = y.loc[valid_labels].astype(str)

    # Remove measurement columns that contain no usable values.
    unusable_columns = [
        column
        for column in X.columns
        if X[column].isna().all()
    ]

    if unusable_columns:
        raise ValueError(
            "These feature columns contain no numeric data: "
            f"{unusable_columns}"
        )

    if y.nunique() < 2:
        raise ValueError(
            "At least two fault classes are required for training."
        )

    # Each class needs enough samples for a stratified split.
    class_counts = y.value_counts()

    if (class_counts < 2).any():
        raise ValueError(
            "Every fault class needs at least two samples:\n"
            f"{class_counts.to_string()}"
        )

    print("\nFault-class distribution:")
    print(class_counts.to_string())

    print("\nFeatures used:")
    for feature in FEATURES:
        print(f"  - {feature}")

    return X, y


# ============================================================
# TRAIN AND EVALUATE
# ============================================================

def train_model(X, y):
    print("\n" + "=" * 60)
    print("SPLITTING DATA")
    print("=" * 60)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples:  {len(X_test)}")

    # Imputation and model training are kept in one pipeline.
    model = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="median"),
            ),
            (
                "classifier",
                RandomForestClassifier(
                    n_estimators=300,
                    random_state=42,
                    class_weight="balanced",
                    n_jobs=-1,
                ),
            ),
        ]
    )

    print("\nTraining Random Forest model...")
    model.fit(X_train, y_train)

    print("Training completed.")

    # Evaluate only on the held-out test set.
    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    print("\n" + "=" * 60)
    print("MODEL EVALUATION")
    print("=" * 60)

    print(f"Test accuracy: {accuracy:.4f}")
    print(f"Test accuracy percentage: {accuracy * 100:.2f}%")

    print("\nClassification report:")

    print(
        classification_report(
            y_test,
            predictions,
            labels=sorted(y.unique()),
            zero_division=0,
        )
    )

    return model, accuracy


# ============================================================
# SAVE MODEL
# ============================================================

def save_model(model, accuracy, y):
    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    model_data = {
        "model": model,
        "features": FEATURES,
        "target": TARGET,
        "pcb_type": "LM2596S",
        "classes": sorted(y.unique()),
        "test_accuracy": float(accuracy),
    }

    # Save to a separate filename so the LM7805 model is preserved.
    joblib.dump(
        model_data,
        MODEL_PATH,
    )

    print("\n" + "=" * 60)
    print("MODEL SAVED SUCCESSFULLY")
    print("=" * 60)

    print(f"\nSaved model:\n{MODEL_PATH}")

    print("\nModel classes:")
    for fault_class in sorted(y.unique()):
        print(f"  - {fault_class}")

    print("\nThe existing LM7805 model was not modified.")
    print(
        "\nNote: Test accuracy measures performance on the "
        "held-out dataset. Real hardware testing is still needed."
    )


# ============================================================
# MAIN
# ============================================================

def main():
    X, y = load_dataset()

    model, accuracy = train_model(
        X,
        y,
    )

    save_model(
        model,
        accuracy,
        y,
    )


if __name__ == "__main__":
    main()
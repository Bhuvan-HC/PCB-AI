from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score


# Project paths
AI_DIR = Path(__file__).resolve().parent.parent

DATASET_PATH = (
    AI_DIR / "datasets" / "processed" / "lm2596s_processed.csv"
)

MODEL_PATH = (
    AI_DIR / "models" / "trained" / "lm2596s_fault_model.pkl"
)

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


def main():
    print("=" * 65)
    print("LM2596S FAULT CLASS TEST")
    print("=" * 65)

    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

    df = pd.read_csv(DATASET_PATH)

    # Load the saved model pipeline.
    artifact = joblib.load(MODEL_PATH)

    model = (
        artifact["model"]
        if isinstance(artifact, dict)
        else artifact
    )

    # Use one sample from each class for a quick smoke test.
    samples = (
        df.groupby("fault_type", sort=True, group_keys=False)
        .head(1)
        .reset_index(drop=True)
    )

    X = samples[FEATURES].apply(pd.to_numeric, errors="coerce")
    expected = samples["fault_type"].astype(str)

    predictions = model.predict(X)

    results = pd.DataFrame({
        "expected": expected.to_numpy(),
        "predicted": predictions,
    })

    results["match"] = results["expected"] == results["predicted"]

    print(f"\nDataset samples: {len(df)}")
    print(f"Fault classes tested: {len(results)}\n")

    print(results.to_string(index=False))

    matches = int(results["match"].sum())
    total = len(results)

    print(f"\nSmoke-test matches: {matches}/{total}")

    if matches == total:
        print("PASS: All selected samples were classified correctly.")
    else:
        print("CHECK: Some selected samples were misclassified.")

    print(
        "\nThis is a smoke test using one sample per class, "
        "not a full independent model evaluation."
    )


if __name__ == "__main__":
    main()
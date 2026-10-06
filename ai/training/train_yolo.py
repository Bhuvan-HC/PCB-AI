from pathlib import Path
from ultralytics import YOLO


# Project paths
AI_DIR = Path(__file__).resolve().parent.parent

DATASET_CONFIG = AI_DIR / "training" / "pcb.yaml"
MODEL_OUTPUT_DIR = AI_DIR / "models" / "trained" / "yolo"


def main():
    print("Starting PCB YOLO training setup...")
    print(f"Dataset configuration: {DATASET_CONFIG}")
    print(f"Model output directory: {MODEL_OUTPUT_DIR}")

    if not DATASET_CONFIG.exists():
        raise FileNotFoundError(
            f"YOLO dataset configuration not found: {DATASET_CONFIG}"
        )

    MODEL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # YOLO pretrained detection model.
    # This is the starting point for custom PCB training.
    model = YOLO("yolo11n.pt")

    results = model.train(
        data=str(DATASET_CONFIG),
        epochs=50,
        imgsz=640,
        batch=8,
        project=str(MODEL_OUTPUT_DIR),
        name="pcb_detector",
        exist_ok=True,
    )

    print("\nYOLO training completed.")
    print(f"Training results: {results}")
    print(f"Model output: {MODEL_OUTPUT_DIR / 'pcb_detector'}")


if __name__ == "__main__":
    main()
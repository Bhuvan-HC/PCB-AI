from pathlib import Path
from ultralytics import YOLO


AI_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = (
    AI_DIR
    / "models"
    / "trained"
    / "yolo"
    / "pcb_detector"
    / "weights"
    / "best.pt"
)


def detect_pcb_components(image_path: str):
    """
    Detect PCB components using the trained custom YOLO model.

    The trained model will be available after the PCB dataset
    has been collected and YOLO training has been completed.
    """

    image = Path(image_path)

    if not image.exists():
        raise FileNotFoundError(f"Image not found: {image}")

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Custom PCB YOLO model is not available yet. "
            f"Expected model at: {MODEL_PATH}"
        )

    model = YOLO(str(MODEL_PATH))

    results = model.predict(
        source=str(image),
        conf=0.25,
        imgsz=640,
        verbose=False,
    )

    detections = []

    for result in results:
        if result.boxes is None:
            continue

        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            class_name = result.names[class_id]

            detections.append(
                {
                    "component": class_name,
                    "confidence": round(confidence, 4),
                    "location": {
                        "x1": round(x1, 2),
                        "y1": round(y1, 2),
                        "x2": round(x2, 2),
                        "y2": round(y2, 2),
                    },
                }
            )

    return {
        "image": str(image),
        "detections": detections,
        "detected_components": len(detections),
    }
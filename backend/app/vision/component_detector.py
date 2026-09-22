from typing import List, Dict, Any


class ComponentDetector:
    """
    Detects electronic components on a PCB image.

    This class is prepared for YOLO integration.
    """

    def __init__(self, model=None, class_names=None):
        self.model = model

        self.class_names = class_names or {
            0: "resistor",
            1: "capacitor",
            2: "diode",
            3: "voltage_regulator",
            4: "fuse",
            5: "led",
            6: "terminal_block",
            7: "connector"
        }

    def detect(
        self,
        image
    ) -> List[Dict[str, Any]]:
        """
        Detect components in a PCB image.

        Returns a list of detected components.
        """

        if self.model is None:
            return []

        results = self.model(image)

        detections = []

        for result in results:

            if result.boxes is None:
                continue

            for box in result.boxes:

                coordinates = box.xyxy[0].tolist()

                confidence = float(
                    box.conf[0]
                )

                class_id = int(
                    box.cls[0]
                )

                class_name = self.class_names.get(
                    class_id,
                    "unknown"
                )

                detections.append({
                    "class_id": class_id,
                    "class_name": class_name,
                    "confidence": confidence,
                    "bbox": coordinates
                })

        return detections

    def filter_by_confidence(
        self,
        detections,
        threshold=0.50
    ):
        """
        Remove detections below the confidence threshold.
        """

        return [
            detection
            for detection in detections
            if detection["confidence"] >= threshold
        ]

    def get_component_names(
        self,
        detections
    ):
        """
        Return the names of detected components.
        """

        return [
            detection["class_name"]
            for detection in detections
        ]
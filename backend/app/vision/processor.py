import cv2
import numpy as np


def analyze_pcb_image(image_bytes: bytes):
    """
    Basic OpenCV analysis of an uploaded PCB image.
    """

    image_array = np.frombuffer(
        image_bytes,
        np.uint8
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if image is None:
        raise ValueError(
            "Unable to decode the uploaded image."
        )

    height, width = image.shape[:2]

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    blurred = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    edges = cv2.Canny(
        blurred,
        50,
        150
    )

    contours, _ = cv2.findContours(
        edges,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    significant_contours = [
        contour
        for contour in contours
        if cv2.contourArea(contour) > 100
    ]

    mean_brightness = float(
        np.mean(gray)
    )

    edge_density = float(
        np.mean(edges > 0)
    )

    return {
        "image": {
            "width": width,
            "height": height,
            "channels": image.shape[2]
        },
        "analysis": {
            "mean_brightness": round(
                mean_brightness,
                2
            ),
            "edge_density": round(
                edge_density,
                4
            ),
            "detected_regions": len(
                significant_contours
            )
        },
        "message": (
            "OpenCV image preprocessing "
            "completed successfully."
        )
    }
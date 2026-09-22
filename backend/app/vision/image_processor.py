import cv2
import numpy as np


class ImageProcessor:
    """
    Preprocesses PCB images before component and fault detection.
    """

    def __init__(self, target_width=640, target_height=640):
        self.target_width = target_width
        self.target_height = target_height

    def load_image(self, image_path: str):
        """Load an image from disk."""

        image = cv2.imread(image_path)

        if image is None:
            raise FileNotFoundError(
                f"Could not load image: {image_path}"
            )

        return image

    def resize(self, image):
        """Resize image to target dimensions."""

        return cv2.resize(
            image,
            (self.target_width, self.target_height),
            interpolation=cv2.INTER_AREA
        )

    def convert_to_grayscale(self, image):
        """Convert BGR image to grayscale."""

        return cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

    def remove_noise(self, image):
        """Reduce image noise."""

        return cv2.GaussianBlur(
            image,
            (5, 5),
            0
        )

    def detect_edges(self, image):
        """Detect PCB and component edges."""

        gray = self.convert_to_grayscale(image)

        blurred = self.remove_noise(gray)

        return cv2.Canny(
            blurred,
            50,
            150
        )

    def preprocess(self, image_path: str):
        """Run the complete preprocessing pipeline."""

        original = self.load_image(image_path)

        resized = self.resize(original)

        grayscale = self.convert_to_grayscale(resized)

        denoised = self.remove_noise(grayscale)

        edges = cv2.Canny(
            denoised,
            50,
            150
        )

        return {
            "original": original,
            "resized": resized,
            "grayscale": grayscale,
            "denoised": denoised,
            "edges": edges
        }

    def get_image_statistics(self, image):
        """Return basic image statistics."""

        if image is None:
            return {}

        return {
            "mean": float(np.mean(image)),
            "standard_deviation": float(np.std(image)),
            "minimum": float(np.min(image)),
            "maximum": float(np.max(image))
        }
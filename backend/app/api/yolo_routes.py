from fastapi import APIRouter, File, UploadFile, HTTPException
from pathlib import Path
import tempfile
import sys
import os


PROJECT_ROOT = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "..",
        ".."
    )
)

AI_PATH = os.path.join(PROJECT_ROOT, "ai")

if AI_PATH not in sys.path:
    sys.path.append(AI_PATH)


from inference.yolo_detector import detect_pcb_components


router = APIRouter(
    prefix="/yolo",
    tags=["YOLO PCB Detection"]
)


@router.post("/detect")
async def detect_components(file: UploadFile = File(...)):
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined."
        )

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    suffix = Path(file.filename or "pcb.jpg").suffix or ".jpg"

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:
            temp_file.write(image_bytes)
            temp_path = Path(temp_file.name)

        result = detect_pcb_components(str(temp_path))

        return {
            "status": "success",
            "filename": file.filename,
            "yolo": result
        }

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"YOLO detection failed: {error}"
        )

    finally:
        if temp_path and temp_path.exists():
            temp_path.unlink()
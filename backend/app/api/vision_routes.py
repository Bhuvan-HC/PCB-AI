from fastapi import APIRouter, File, UploadFile, HTTPException

from app.vision.processor import analyze_pcb_image


router = APIRouter(
    prefix="/vision",
    tags=["Computer Vision"]
)


@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...)
):
    """
    Receive a PCB image and perform basic OpenCV analysis.
    """

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

    try:
        result = analyze_pcb_image(image_bytes)

        return {
            "status": "success",
            "filename": file.filename,
            "vision": result
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Image processing failed: {error}"
        )
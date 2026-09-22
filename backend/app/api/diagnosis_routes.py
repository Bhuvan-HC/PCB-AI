from typing import Optional, Dict, Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


# --------------------------------------------------
# API ROUTER
# --------------------------------------------------

router = APIRouter(
    prefix="/api/diagnosis",
    tags=["Diagnosis"]
)


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class DiagnosisRequest(BaseModel):
    image_path: Optional[str] = None

    measurements: Dict[str, Any] = Field(
        default_factory=dict
    )


# --------------------------------------------------
# RESPONSE MODEL
# --------------------------------------------------

class DiagnosisResponse(BaseModel):
    status: str
    fault_type: str
    component: Optional[str] = None
    confidence: float
    message: str


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@router.get("/health")
def diagnosis_health():
    """
    Check whether the AI diagnosis API is running.
    """

    return {
        "status": "online",
        "service": "AI PCB Diagnosis"
    }


# --------------------------------------------------
# RUN DIAGNOSIS
# --------------------------------------------------

@router.post(
    "/run",
    response_model=DiagnosisResponse
)
def run_diagnosis(
    request: DiagnosisRequest
):
    """
    Receive PCB image information and electrical
    measurements for diagnosis.

    The actual AI diagnosis engine will be connected
    later.
    """

    if (
        request.image_path is None
        and not request.measurements
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Image path or measurements "
                "are required."
            )
        )

    return DiagnosisResponse(
        status="processing",
        fault_type="unknown",
        component=None,
        confidence=0.0,
        message=(
            "PCB test data received. "
            "AI diagnosis pipeline is ready "
            "for model integration."
        )
    )
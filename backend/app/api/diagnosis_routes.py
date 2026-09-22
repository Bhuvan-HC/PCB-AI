from fastapi import APIRouter
from app.schemas.diagnosis_schema import DiagnosisRequest

import sys
import os

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..")
)

AI_PATH = os.path.join(PROJECT_ROOT, "ai")

if AI_PATH not in sys.path:
    sys.path.append(AI_PATH)

from inference.diagnosis import diagnose


router = APIRouter(
    prefix="/diagnosis",
    tags=["AI Diagnosis"]
)


@router.post("/predict")
def predict_fault(data: DiagnosisRequest):
    result = diagnose(data.model_dump())

    return {
        "status": "success",
        "diagnosis": result
    }
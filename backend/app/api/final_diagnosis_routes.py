
from fastapi import APIRouter, HTTPException
from app.schemas.diagnosis_schema import DiagnosisRequest
from app.validation.measurement_validator import validate_measurements

import sys
import os


PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..")
)

AI_PATH = os.path.join(PROJECT_ROOT, "ai")

if AI_PATH not in sys.path:
    sys.path.insert(0, AI_PATH)

from inference.diagnosis import diagnose, diagnose_lm2596s
from inference.final_diagnosis import combine_diagnosis


router = APIRouter(
    prefix="/final-diagnosis",
    tags=["Final AI Diagnosis"]
)


@router.post("/predict")
def predict_final_diagnosis(data: DiagnosisRequest):
    measurements = data.model_dump(exclude={"pcb_type"})
    pcb_type = data.pcb_type

    validation = validate_measurements(measurements)

    if not validation["valid"]:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Invalid PCB measurements.",
                "validation": validation
            }
        )

    if pcb_type == "LM2596S":
        electrical_result = diagnose_lm2596s(measurements)
    else:
        electrical_result = diagnose(measurements)

    visual_detections = []

    final_result = combine_diagnosis(
        electrical_diagnosis=electrical_result,
        visual_detections=visual_detections,
    )

    final_result["pcb_type"] = pcb_type

    return {
        "status": "success",
        "pcb_type": pcb_type,
        "validation": validation,
        "diagnosis": final_result,
    }

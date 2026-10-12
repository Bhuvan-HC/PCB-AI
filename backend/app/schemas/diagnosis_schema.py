
from typing import Literal

from pydantic import BaseModel


class DiagnosisRequest(BaseModel):
    input_voltage: float
    output_voltage: float
    current: float
    temperature_1: float
    temperature_2: float
    tp1_voltage: float
    tp2_voltage: float
    tp3_voltage: float
    continuity: int

    pcb_type: Literal["LM7805", "LM2596S"] = "LM7805"

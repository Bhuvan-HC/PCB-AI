from pydantic import BaseModel, Field


class DiagnosisRequest(BaseModel):
    pcb_type: str = Field(default="LM2596S")

    input_voltage: float
    output_voltage: float
    current: float
    temperature_1: float
    temperature_2: float
    tp1_voltage: float
    tp2_voltage: float
    tp3_voltage: float
    continuity: int
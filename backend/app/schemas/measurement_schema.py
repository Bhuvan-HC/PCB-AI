from pydantic import BaseModel


class Measurement(BaseModel):
    voltage: float
    current: float
    temperature: float
    channel: int
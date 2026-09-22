from fastapi import APIRouter
from app.schemas.measurement_schema import Measurement

router = APIRouter(
    prefix="/measurements",
    tags=["Measurements"]
)

latest_measurement = Measurement(
    voltage=0.0,
    current=0.0,
    temperature=0.0,
    channel=0
)


def set_latest_measurement(data: dict):
    global latest_measurement

    latest_measurement = Measurement(**data)


@router.get("/latest", response_model=Measurement)
def get_latest_measurement():
    return latest_measurement


@router.post("/update", response_model=Measurement)
def update_measurement(measurement: Measurement):
    global latest_measurement

    latest_measurement = measurement

    return latest_measurement
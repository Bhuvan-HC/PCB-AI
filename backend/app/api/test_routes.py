from fastapi import APIRouter
from app.api.measurement_routes import set_latest_measurement

router = APIRouter(
    prefix="/test",
    tags=["Testing"]
)


@router.post("/simulate-measurement")
def simulate_measurement():
    test_data = {
        "voltage": 12.01,
        "current": 0.18,
        "temperature": 28.4,
        "channel": 0
    }

    set_latest_measurement(test_data)

    return {
        "status": "success",
        "message": "Simulated ESP32 measurement received",
        "measurement": test_data
    }
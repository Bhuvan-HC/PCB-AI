from fastapi import FastAPI
from app.api.measurement_routes import router as measurement_router
from app.api.test_routes import router as test_router

app = FastAPI(
    title="PCB AI Fault Detection Backend",
    version="1.0.0"
)

app.include_router(measurement_router)
app.include_router(test_router)


@app.get("/")
def root():
    return {
        "system": "PCB AI Fault Detection System",
        "status": "Backend running",
        "member": "Member 1"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
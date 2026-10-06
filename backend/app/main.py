from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.measurement_routes import router as measurement_router
from app.api.test_routes import router as test_router
from app.api.diagnosis_routes import router as diagnosis_router
from app.api.vision_routes import router as vision_router
from app.api.yolo_routes import router as yolo_router
from app.api.final_diagnosis_routes import router as final_diagnosis_router


app = FastAPI(
    title="PCB AI Fault Detection Backend",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(measurement_router)
app.include_router(test_router)
app.include_router(diagnosis_router)
app.include_router(vision_router)
app.include_router(yolo_router)
app.include_router(final_diagnosis_router)


@app.get("/")
def root():
    return {
        "system": "PCB AI Fault Detection System",
        "status": "Backend running",
        "member": "Main / AI Integration"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["health"])

class HealthData(BaseModel):
    status: str
    service: str

class HealthEnvelope(BaseModel):
    code: str
    message: str
    data: HealthData

@router.get("/health", response_model=HealthEnvelope)
def health() -> HealthEnvelope:
    return HealthEnvelope(code="OK", message="success", data=HealthData(status="ok", service="mahjong-skill-backend"))

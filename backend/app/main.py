from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.health import router as health_router
from app.core.config import settings

app = FastAPI(title="Mahjong Skill API", version="0.1.0", description="雀变统一业务 API")
app.add_middleware(CORSMiddleware,
    allow_origins=[s.strip() for s in settings.cors_origins.split(",") if s.strip()],
    allow_credentials=True, allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)
app.include_router(health_router, prefix="/api/v1")

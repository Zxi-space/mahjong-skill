from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "sqlite:///./backend/mahjong_skill.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:3000,http://127.0.0.1:3000"
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

settings = Settings()

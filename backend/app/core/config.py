from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "LabLens"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # AI Provider Settings
    AI_PROVIDER: str = "ollama"  # "ollama" or "openai" or "curated"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "gemma4:12b"
    
    # Optional cloud providers
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.8-flash"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    ALLOW_CLOUD_FALLBACK: bool = False
    
    REQUEST_TIMEOUT_SECONDS: int = 60
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./lablens.db"
    
    # File Upload Limits
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "png", "jpg", "jpeg"]
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

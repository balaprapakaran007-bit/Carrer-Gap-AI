from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerGap AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # AI & API keys
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    # Firebase
    FIREBASE_PROJECT_ID: str = "careergap-ai"
    FIREBASE_CLIENT_EMAIL: str = ""
    FIREBASE_PRIVATE_KEY: str = ""
    FIREBASE_DATABASE_URL: str = ""
    
    # Security & CORS
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Feature flags
    JOB_URL_FETCH_ALLOWLIST: str = "linkedin.com,indeed.com,glassdoor.com,lever.co,greenhouse.io,workday.com,builtin.com,wellfound.com,monster.com,ziprecruiter.com,dice.com,techcareers.com,ycombinator.com,github.com"
    ENABLE_EMAIL_REMINDERS: bool = False
    
    # Scoring weights
    WEIGHT_CRITICAL: float = 0.40
    WEIGHT_HIGH: float = 0.30
    WEIGHT_MEDIUM: float = 0.20
    WEIGHT_EVIDENCE: float = 0.10
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()

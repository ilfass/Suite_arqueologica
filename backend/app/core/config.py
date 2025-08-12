import os
from pydantic import BaseModel

class Settings(BaseModel):
    environment: str = os.getenv("ENVIRONMENT", "development")
    database_url: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://suite:suite@postgres:5432/suite")
    keycloak_issuer: str | None = os.getenv("KEYCLOAK_ISSUER")
    keycloak_audience: str | None = os.getenv("KEYCLOAK_AUDIENCE")

settings = Settings()


from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Load from a top-level .env file (relative to the backend working dir).
        env_file='.env',
        env_ignore_empty=True,
        extra='ignore',
    )

    PROJECT_NAME: str = 'Quizzer'

    # ---- Security ----
    # No default on purpose: the app must refuse to start without a real secret
    # instead of silently shipping a hardcoded one.
    SECRET_KEY: str

    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # ---- CORS ----
    # Provided as a comma-separated string in the environment, parsed to a list.
    BACKEND_CORS_ORIGINS: list[str] = ['http://localhost:3001']

    # ---- Database ----
    POSTGRES_URI: str

    # ---- Uploads ----
    UPLOAD_DIRECTORY: str = 'static/pictures'

    @field_validator('BACKEND_CORS_ORIGINS', mode='before')
    @classmethod
    def _split_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(',') if origin.strip()]
        return value


settings = Settings()  # type: ignore[call-arg]

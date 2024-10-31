# import secrets

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Use top level .env file (one level above ./backend/)
        env_file='.env',
        env_ignore_empty=True,
        extra='ignore',
    )

    PROJECT_NAME: str = 'Project'

    # security stuff
    # SECRET_KEY: str = secrets.token_urlsafe(32)
    SECRET_KEY: str = '6CiMgz39-Hf-KlJlRZ0sDzE3SUF7J9S87xCJmtur3Y4'

    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # frontend stuff
    FRONTEND_HOST: str = 'http://localhost:5173'

    # database stuff
    POSTGRES_URI: str = ''
    UPLOAD_DIRECTORY: str


settings = Settings()  # type: ignore

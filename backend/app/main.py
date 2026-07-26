import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.main import api_router
from app.core.config import settings

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title=settings.PROJECT_NAME,
    docs_url='/docs',
    openapi_url='/openapi.json',
)

# Ensure the upload directory exists before mounting static files.
os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
os.makedirs('static', exist_ok=True)

app.mount('/static', StaticFiles(directory='static'), name='static')

# Restrict CORS to the configured frontend origins. Never combine a wildcard
# origin with allow_credentials=True -- browsers reject that combination and it
# defeats the purpose of credentialed requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health', tags=['health'])
def health_check() -> dict[str, str]:
    """Lightweight liveness probe used by Docker/CI healthchecks."""
    return {'status': 'ok'}


app.include_router(api_router, prefix='/API')

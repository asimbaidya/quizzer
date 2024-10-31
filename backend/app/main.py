import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.main import api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# WARN: ensure the directory exists
os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)

app.mount('/static', StaticFiles(directory='static'), name='static')


origins = ['http://127.0.0.1:3000', 'http://localhost:3000', '*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


app.include_router(api_router, prefix='/API')

from fastapi import APIRouter
from app.core.config import settings


router = APIRouter()
"""
doing dangerous stuff to debug with ease
"""


@router.get("/test")
async def test():
    print(settings.POSTGRES_URI)
    return {"Hello": "World", "POSTGRES_URI": "check Console"}


@router.get("/test/env")
def env():
    print(settings.model_dump())
    return "ceck Console"

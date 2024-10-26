from fastapi import APIRouter

from app.api.deps import CurrentUser, TokenDep
from app.core.config import settings

router = APIRouter()


@router.get("/test")
async def test():
    print(settings.POSTGRES_URI)
    return {"Hello": "World", "POSTGRES_URI": "check Console"}


@router.get("/test/env")
def env(user: CurrentUser):
    print(f"asked by {user.to_dict()}")
    print(settings.model_dump())
    print(user.to_dict())
    return {"I can See You": user.to_dict()}


@router.get("/items/")
async def read_items(token: TokenDep):
    return {"token": token}

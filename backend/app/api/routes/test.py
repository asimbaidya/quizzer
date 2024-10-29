from fastapi import APIRouter

from app.api.deps import CurrentAdmin, TokenDep
from app.core.config import settings

router = APIRouter()


@router.get('/test/env')
def env(_user: CurrentAdmin):
    return settings.model_dump()


@router.get('/items/')
async def read_items(token: TokenDep):
    return {'token': token}

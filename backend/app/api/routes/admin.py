from fastapi import APIRouter

from app.api.ensure.math import ensure_math

router = APIRouter()

# can add new user, delete user, view_all_users


@router.get('/')
def home():
    ensure_math(1, 2)
    return {'message': 'Hello, World From Admin!'}

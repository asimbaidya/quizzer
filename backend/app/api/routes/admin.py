from fastapi import APIRouter

router = APIRouter()

# can add new user, delete user, view_all_users


@router.get('/')
def home():
    return {'message': 'Hello, World From Admin!'}

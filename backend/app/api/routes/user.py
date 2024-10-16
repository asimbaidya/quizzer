from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate
from app.crud import user as user_crud
from app.api.deps import SessionDep

router = APIRouter()


@router.post("/signup")
def register_user(user: UserCreate, db: SessionDep):
    existing_user = user_crud.get_user_by_email(db, email=user.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    new_user = user_crud.create_user(db, user_create=user)
    return new_user

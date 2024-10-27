from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


def create_user(db: Session, user_create: UserCreate) -> User:
    user: User = User(
        full_name=user_create.full_name,
        email=user_create.email,
        hashed_password=get_password_hash(user_create.password),
        role=user_create.role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def authenticate(db: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(db, email=email)
    if not db_user:
        return None
    if not verify_password(password, str(db_user.hashed_password)):
        return None
    return db_user

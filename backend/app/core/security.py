from datetime import datetime, timedelta, timezone
from typing import Any

import jwt  # type: ignore
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


ALGORITHM = 'HS256'


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {'exp': expire, 'sub': str(subject)}  # type: ignore
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)  # type: ignore


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

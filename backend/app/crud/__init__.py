"""CRUD package.

Re-exports domain CRUD helpers so callers can keep using ``from app import crud``
and ``crud.create_user(...)`` regardless of how the implementation is split.
"""

from app.crud.user import (
    authenticate,
    create_user,
    get_user_by_email,
    update_user,
)

__all__ = [
    "authenticate",
    "create_user",
    "get_user_by_email",
    "update_user",
]

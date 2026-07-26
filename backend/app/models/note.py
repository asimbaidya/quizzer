import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Field, Relationship, SQLModel

from app.models.common import get_datetime_utc
from app.models.payloads import NoteItem

if TYPE_CHECKING:
    from app.models.user import User


class Note(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(default="Untitled", max_length=255)
    # List of note blocks (validated by list[NoteItem] at the boundary).
    note_data: list[dict[str, Any]] = Field(sa_column=Column(JSONB, nullable=False))
    user_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )
    updated_at: datetime | None = Field(
        default=None,
        sa_type=DateTime(timezone=True),  # type: ignore[call-overload]
    )

    creator: "User" = Relationship(back_populates="notes")


# ---- API payloads ----
class NoteBase(SQLModel):
    title: str = "Untitled"
    note_data: list[NoteItem] = []


class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    pass


class NotePublic(SQLModel):
    id: uuid.UUID
    title: str
    note_data: list[NoteItem]
    user_id: uuid.UUID
    created_at: datetime | None = None
    updated_at: datetime | None = None

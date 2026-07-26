import os
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from app import crud
from app.api.deps import CurrentAdmin, SessionDep, get_current_admin
from app.core.config import settings
from app.models import Message, Note, Question, UserCreate, UserPublic

router = APIRouter(
    prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.post("/users", response_model=UserPublic)
def add_user(session: SessionDep, user_in: UserCreate) -> Any:
    existing = crud.get_user_by_email(session=session, email=user_in.email)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    return crud.create_user(session=session, user_create=user_in)


@router.post("/images/prune", response_model=Message)
def delete_unused_images(session: SessionDep, _admin: CurrentAdmin) -> Any:
    """Delete uploaded images no longer referenced by any question or note."""
    image_dir = settings.UPLOAD_DIRECTORY
    os.makedirs(image_dir, exist_ok=True)
    all_files = set(os.listdir(image_dir))

    used: set[str] = set()
    for question in session.exec(
        select(Question).where(Question.image.is_not(None))  # type: ignore[union-attr]
    ).all():
        if question.image:
            used.add(question.image)
    for note in session.exec(select(Note)).all():
        for block in note.note_data:
            image = block.get("image") if isinstance(block, dict) else None
            if isinstance(image, str):
                used.add(image)

    unused = all_files - used
    for file_name in unused:
        try:
            os.remove(os.path.join(image_dir, file_name))
        except OSError as exc:
            raise HTTPException(
                status_code=500, detail=f"Error deleting {file_name}: {exc}"
            )

    return Message(
        message=f"Deleted {len(unused)} unused images"
        if unused
        else "No files to delete"
    )

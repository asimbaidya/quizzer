import uuid

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models import Note, NoteCreate, NoteUpdate, get_datetime_utc


def get_notes(session: Session, student_id: uuid.UUID) -> list[Note]:
    return list(session.exec(select(Note).where(Note.user_id == student_id)).all())


def get_note_or_404(
    session: Session, student_id: uuid.UUID, note_id: uuid.UUID
) -> Note:
    note = session.exec(
        select(Note).where(Note.user_id == student_id, Note.id == note_id)
    ).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


def create_note(session: Session, student_id: uuid.UUID, note_in: NoteCreate) -> Note:
    note = Note(
        title=note_in.title,
        note_data=[item.model_dump() for item in note_in.note_data],
        user_id=student_id,
    )
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


def update_note(
    session: Session, student_id: uuid.UUID, note_id: uuid.UUID, note_in: NoteUpdate
) -> Note:
    note = get_note_or_404(session, student_id, note_id)
    note.title = note_in.title
    note.note_data = [item.model_dump() for item in note_in.note_data]
    note.updated_at = get_datetime_utc()
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


def delete_note(session: Session, student_id: uuid.UUID, note_id: uuid.UUID) -> Note:
    note = get_note_or_404(session, student_id, note_id)
    session.delete(note)
    session.commit()
    return note

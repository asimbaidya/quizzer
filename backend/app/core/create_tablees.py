from app.core.db import engine, Base

from app.models.note import Note  # type: ignore
from app.models.user import User  # type: ignore
from app.models.quiz import Question  # type: ignore


def create_tables():
    Base.metadata.create_all(engine)
    for table in Base.metadata.tables:
        print(table)

from app.core.db import Base, engine
from app.models.note import Note
from app.models.quiz import Quiz
from app.models.user import User

__imported_tables = [User, Note, Quiz]


def create_all_tables():
    Base.metadata.create_all(engine)
    for table in Base.metadata.tables:
        print(f'{table} created')


def drop_all_tables():
    Base.metadata.drop_all(engine)

    for table in Base.metadata.tables:
        print(f'{table} dropped')

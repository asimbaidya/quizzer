from app.core.db import Base, engine, sessionmaker
from app.core.initial_data import users

# from app.models.note import Note
from app.models.quiz import Quiz
from app.models.user import User

__imported_tables = [User, Quiz]

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_all_tables():
    Base.metadata.create_all(engine)
    for table in Base.metadata.tables:
        print(f'{table} created')

    for user in users:
        user_instance = User(**user)
        db = SessionLocal()
        db.add(instance=user_instance)
        db.commit()


def drop_all_tables():
    Base.metadata.drop_all(engine)

    for table in Base.metadata.tables:
        print(f'{table} dropped')

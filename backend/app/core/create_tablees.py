from app.core.db import Base, engine


def create_tables():
    Base.metadata.create_all(engine)
    for table in Base.metadata.tables:
        print(table)

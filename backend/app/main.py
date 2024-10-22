from fastapi import FastAPI
from app.core.db import engine, SessionLocal, Base
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from sqlalchemy import text


from app.api.main import api_router
from app.core.config import settings

from app.models.quiz import (
    Course,
    Enrollment,
    Question,
    QuestionAttempt,
    Quiz,
    QuizAttempt,
)
from app.models.user import User
from app.models.note import Note
# from app.models.game import GameSession, GameParticipant


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Try to create a session and perform an ORM operation
        db: Session = SessionLocal()
        db.execute(text("SELECT 1"))  # Executes a simple query to test the connection
        print(f"`{app.title}` has Connected to the database: `{settings.POSTGRES_URI}`")
        Base.metadata.create_all(engine)
        tables = [  # type: ignore
            Course,
            Enrollment,
            Question,
            Quiz,
            QuizAttempt,
            Question,
            QuestionAttempt,
            User,
            Note,
            # GameSession,
            # GameParticipant,
        ]
        for tab in tables:  # type: ignore
            print(f"{tab} Table Created")  # type: ignore
        db.close()
    except Exception as e:
        print(f"Database connection failed: {e}")

    yield

    try:
        engine.dispose()
        print("Database connection closed and resources cleaned up")
    except Exception as e:
        print(f"Error during shutdown: {e}")


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
)

app.include_router(api_router, prefix="/API")

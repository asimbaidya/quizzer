from fastapi import FastAPI
from app.core.db import engine, SessionLocal
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from sqlalchemy import text


from app.api.main import api_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Try to create a session and perform an ORM operation
        db: Session = SessionLocal()
        db.execute(text("SELECT 1"))  # Executes a simple query to test the connection
        db.close()
        print(f"`{app.title}` has Connected to the database: `{settings.POSTGRES_URI}`")
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

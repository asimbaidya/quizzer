from fastapi import APIRouter
from app.api.routes import test
from app.api.routes import user
from app.api.routes import login
from app.api.routes import quiz
from app.api.routes import course
from app.api.routes import question


api_router = APIRouter()


api_router.include_router(login.router, tags=["login"])
api_router.include_router(test.router, prefix="/test", tags=["test"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
api_router.include_router(course.router, prefix="/course", tags=["course"])
api_router.include_router(question.router, prefix="/question", tags=["question"])

from fastapi import APIRouter
from app.api.routes import test
from app.api.routes import user
from app.api.routes import login
from app.api.routes import quizzer


api_router = APIRouter()


api_router.include_router(login.router, tags=["login"])
api_router.include_router(test.router, prefix="/test", tags=["test"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
api_router.include_router(quizzer.router, prefix="/quiz", tags=["quiz"])

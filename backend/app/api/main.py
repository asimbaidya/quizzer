from fastapi import APIRouter

from app.api.routes import login, users, utils

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)

# Domain routers (courses, quizzes, tests, questions, submissions, notes)
# are registered here as they are ported.

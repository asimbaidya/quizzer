from fastapi import APIRouter

from app.api.routes import admin, images, login, student, teacher, users, utils

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)

# Domain routers
api_router.include_router(teacher.router)
api_router.include_router(student.router)
api_router.include_router(admin.router)
api_router.include_router(images.router)

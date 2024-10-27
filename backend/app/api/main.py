from fastapi import APIRouter

from app.api.routes import admin, login, student, teacher, test, user

api_router = APIRouter()


api_router.include_router(login.router, tags=['login'])
api_router.include_router(test.router, prefix='/test', tags=['test'])
api_router.include_router(user.router, prefix='/user', tags=['user'])

# Role Based Routes
api_router.include_router(student.router, prefix='/student', tags=['student'])
api_router.include_router(teacher.router, prefix='/teacher', tags=['teacher'])
api_router.include_router(admin.router, prefix='/admin', tags=['admin'])

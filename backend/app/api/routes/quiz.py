from fastapi import APIRouter
from app.schemas.quiz import QuizCreate
from app.crud import quiz_crud
from app.api.deps import SessionDep

router = APIRouter()


@router.post("/quizzes")
def create_quiz(db: SessionDep, quiz: QuizCreate):
    new_quiz = quiz_crud.create_quiz(db, quiz_create=quiz)
    return {"quiz": new_quiz}

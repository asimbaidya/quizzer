from fastapi import APIRouter
from app.schemas.question import QuestionCreate
from app.crud import question_crud
from app.api.deps import SessionDep

router = APIRouter()


@router.post("/questions")
def create_question(db: SessionDep, question: QuestionCreate):
    new_question = question_crud.create_question(db, question_create=question)
    return {"question": new_question}

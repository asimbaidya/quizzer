from fastapi import APIRouter, HTTPException
from app.schemas.question import QuestionCreate
from app.crud import question_crud, quiz_crud, course_crud
from app.api.deps import SessionDep, CurrentTeacher

router = APIRouter()


@router.post("/")
def create_question(db: SessionDep, question: QuestionCreate, teacher: CurrentTeacher):
    try:
        quiz = quiz_crud.get_quiz_by_id(db, question.quiz_id)
        if quiz is None:
            return HTTPException(
                status_code=400,
                detail="Quiz with this ID does not exist",
            )

        course_creator_id = course_crud.get_course_creator_id(db, quiz.course_id)  # type: ignore
        if course_creator_id is None:
            return HTTPException(
                status_code=400,
                detail="Course with this ID does not exist",
            )
        if course_creator_id != teacher.id:
            return HTTPException(
                status_code=403,
                detail="You are not the creator of this course",
            )

        new_question = question_crud.create_question(db, question_create=question)
        return new_question
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from fastapi import APIRouter, HTTPException
from app.schemas.quiz import QuizCreate
from app.crud import quiz_crud
from app.crud import course_crud
from app.api.deps import SessionDep, CurrentTeacher

router = APIRouter()


@router.post("/")
def create_quiz(db: SessionDep, quiz: QuizCreate, teacher: CurrentTeacher):
    try:
        course_creator_id = course_crud.get_course_creator_id(db, quiz.course_id)
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

        new_quiz = quiz_crud.create_quiz(db, quiz_create=quiz)

        return new_quiz

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

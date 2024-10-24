from fastapi import APIRouter, HTTPException
from app.schemas.quiz import QuizCreate
from app.crud import quiz_crud, course_crud, question_crud
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


@router.get("/{course_title}/{quiz_id}")
def get_quiz_by_id(db: SessionDep, course_title: str, quiz_id: int,teacher: CurrentTeacher):
    course = course_crud.get_course_by_title(db, course_title)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    quiz = quiz_crud.get_quiz_by_id(db, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = question_crud.get_questions_by_quiz_id(db, quiz_id)
    return questions

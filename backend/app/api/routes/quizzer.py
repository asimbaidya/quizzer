from fastapi import APIRouter
from app.schemas.quizzer import CourseCreate, QuizCreate, QuestionCreate
from app.crud import quizzer_crud
from app.api.deps import CurrentTeacher, SessionDep

router = APIRouter()


@router.post("/courses")
def create_course(
    db: SessionDep,
    course: CourseCreate,
    teacher: CurrentTeacher,
):
    new_course = quizzer_crud.create_course(
        db, course_create=course, creator_id=teacher.id.value
    )
    return {"course": new_course}


@router.post("/quizzes")
def create_quiz(db: SessionDep, quiz: QuizCreate):
    new_quiz = quizzer_crud.create_quiz(db, quiz_create=quiz)
    return {"quiz": new_quiz}


@router.post("/questions")
def create_question(db: SessionDep, question: QuestionCreate):
    new_question = quizzer_crud.create_question(db, question_create=question)
    return {"question": new_question}
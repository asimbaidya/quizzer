import uuid
from typing import Any

from fastapi import APIRouter

from app.api.deps import CurrentTeacher, SessionDep
from app.crud import course as course_crud
from app.crud import progress as progress_crud
from app.crud import question as question_crud
from app.crud import quiz as quiz_crud
from app.models import (
    CourseCreate,
    CoursePublic,
    Message,
    QuestionCreate,
    QuizCreate,
    TestCreate,
    UserPublic,
)

router = APIRouter(prefix="/teacher", tags=["teacher"])


# ---- Courses ----
@router.get("/courses", response_model=list[CoursePublic])
def get_courses(session: SessionDep, teacher: CurrentTeacher) -> Any:
    return course_crud.get_courses_by_creator(session, teacher.id)


@router.post("/course", response_model=CoursePublic)
def create_course(
    session: SessionDep, course: CourseCreate, teacher: CurrentTeacher
) -> Any:
    return course_crud.create_course(session, course, teacher.id)


@router.get("/course/{course_title}")
def get_quizzes_and_tests(
    course_title: str, session: SessionDep, teacher: CurrentTeacher
) -> dict[str, Any]:
    course = course_crud.get_teacher_course_or_404(session, course_title, teacher.id)
    quizzes, tests = quiz_crud.get_quizzes_and_tests(session, course)
    return {"quizzes": quizzes, "tests": tests}


@router.get("/course/students/{course_title}", response_model=list[UserPublic])
def get_enrolled_students(
    course_title: str, session: SessionDep, teacher: CurrentTeacher
) -> Any:
    return course_crud.get_enrolled_students(session, course_title, teacher.id)


# ---- Quizzes / Tests ----
@router.post("/course/quiz/{course_title}")
def create_quiz(
    course_title: str, quiz: QuizCreate, session: SessionDep, teacher: CurrentTeacher
) -> Any:
    return quiz_crud.create_quiz(session, quiz, course_title, teacher.id)


@router.post("/course/test/{course_title}")
def create_test(
    course_title: str, test: TestCreate, session: SessionDep, teacher: CurrentTeacher
) -> Any:
    return quiz_crud.create_test(session, test, course_title, teacher.id)


# ---- Questions ----
@router.get("/course/quiz/{course_title}/{quiz_id}")
def get_questions_in_quiz(
    course_title: str,
    quiz_id: uuid.UUID,
    session: SessionDep,
    teacher: CurrentTeacher,
) -> Any:
    return question_crud.list_quiz_questions_for_teacher(
        session, course_title, quiz_id, teacher.id
    )


@router.get("/course/test/{course_title}/{test_id}")
def get_questions_in_test(
    course_title: str,
    test_id: uuid.UUID,
    session: SessionDep,
    teacher: CurrentTeacher,
) -> Any:
    return question_crud.list_test_questions_for_teacher(
        session, course_title, test_id, teacher.id
    )


@router.post("/course/quiz/{course_title}/{quiz_id}", response_model=Message)
def create_question_in_quiz(
    course_title: str,
    quiz_id: uuid.UUID,
    question: QuestionCreate,
    session: SessionDep,
    teacher: CurrentTeacher,
) -> Any:
    question_crud.create_question_in_quiz(
        session, question, course_title, quiz_id, teacher.id
    )
    return Message(message="Question created successfully")


@router.post("/course/test/{course_title}/{test_id}", response_model=Message)
def create_question_in_test(
    course_title: str,
    test_id: uuid.UUID,
    question: QuestionCreate,
    session: SessionDep,
    teacher: CurrentTeacher,
) -> Any:
    question_crud.create_question_in_test(
        session, question, course_title, test_id, teacher.id
    )
    return Message(message="Question created successfully")


# ---- Progress ----
@router.get("/course/quiz/students/{course_title}/{quiz_id}")
def get_quiz_progress(
    course_title: str,
    quiz_id: uuid.UUID,
    session: SessionDep,
    teacher: CurrentTeacher,
) -> Any:
    return progress_crud.get_quiz_progress(session, course_title, quiz_id, teacher.id)


@router.get("/course/test/students/{course_title}/{test_id}")
def get_test_progress(
    course_title: str,
    test_id: uuid.UUID,
    session: SessionDep,
    teacher: CurrentTeacher,
) -> Any:
    return progress_crud.get_test_progress(session, course_title, test_id, teacher.id)

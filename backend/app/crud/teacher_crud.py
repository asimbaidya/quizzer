from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.quiz import (
    Course,
    Enrollment,
    Question,
    QuestionSet,
    QuestionSubmission,
    Quiz,
    Test,
)
from app.models.user import User
from app.schemas.common import CourseCreate, QuizCreate, TestCreate
from app.schemas.question import QuestionTeacherView


def get_courses_by_creator_id(db: Session, creator_id: int) -> list[Course]:
    return db.query(Course).filter(Course.creator_id == creator_id).all()


def get_quiz_and_test_by_course_title_creator_id(  # type: ignore
    db: Session, course_title: str, teacher_id: int
):
    quizzes = (
        db.query(Quiz)
        .join(Course, Quiz.course_id == Course.id)
        .filter(Course.title == course_title, Course.creator_id == teacher_id)
        .all()
    )
    tests = (
        db.query(Test)
        .join(Course, Test.course_id == Course.id)
        .filter(Course.title == course_title, Course.creator_id == teacher_id)
        .all()
    )
    for quiz in quizzes:
        quiz.url = f'teacher/courses/quiz/{course_title}/{quiz.id}'

    # Create URLs for tests
    for test in tests:
        test.url = f'teacher/courses/test/{course_title}/{test.id}'

    return {
        'quizzes': quizzes,
        'tests': tests,
    }  # type: ignore


# TODO: NOT SURE JOIN LOGIC
def get_enrolled_students(db: Session, course_title: str, teacher_id: int):
    return (
        db.query(User)
        .join(Enrollment, User.id == Enrollment.student_id)
        .join(Course, Enrollment.course_id == Course.id)
        .filter(course_title == course_title, User.id == teacher_id)  # type: ignore
        .all()
    )


def get_questions_by_course_title_quiz_id_teacher_id(
    db: Session, course_title: str, quiz_id: int, teacher_id: int
):
    questions = (
        db.query(Question)
        .join(Quiz, Question.question_set_id == Quiz.question_set_id)
        .join(Course, Quiz.course_id == Course.id)
        .join(QuestionSet, Quiz.question_set_id == Question.question_set_id)
        .filter(
            Course.title == course_title,
            Quiz.id == quiz_id,
            Course.creator_id == teacher_id,
        )
        .all()
    )
    for question in questions:
        if question.image is not None:
            question.image_url = (
                f'http://127.0.0.1:8000/API/image_show/{question.image}'
            )
    return questions


def get_questions_by_course_title_test_id_teacher_id(
    db: Session, course_title: str, test_id: int, teacher_id: int
):
    course = db.query(Course).filter(Course.title == course_title).first()
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test or not course or test.course_id != course.id:  # type: ignore
        raise HTTPException(
            status_code=404,
            detail='Course or Test not found or Test does not belong to this course',
        )

    questions = (
        db.query(Question)
        .join(Test, Question.question_set_id == Test.question_set_id)
        .join(Course, Test.course_id == Course.id)
        .join(QuestionSet, Test.question_set_id == Question.question_set_id)
        .filter(
            Course.title == course_title,
            Test.id == test_id,
            Course.creator_id == teacher_id,
        )
        .all()
    )
    for question in questions:
        if question.image is not None:
            question.image_url = (
                f'http://127.0.0.1:8000/API/image_show/{question.image}'
            )
    return questions


def get_student_progress_course_title_quiz_id_teacher_id(
    db: Session, course_title: str, quiz_id: int, teacher_id: int
):
    return (
        db.query(QuestionSubmission)
        .join(User, QuestionSubmission.user_id == User.id)
        .join(Enrollment, User.id == Enrollment.student_id)
        .join(Course, Enrollment.course_id == Course.id)
        .filter(
            Course.title == course_title,
            Quiz.id == quiz_id,
            Course.creator_id == teacher_id,
        )
        .all()
    )


# FOR POST REQUESTS


def create_course_by_teacher_id(
    db: Session, course_create: CourseCreate, teacher_id: int
) -> Course:
    # Becausee course title is unique(design issue)
    course = db.query(Course).filter(Course.title == course_create.title).first()
    if course is not None:
        raise HTTPException(
            status_code=400, detail='Course with this title already exists'
        )

    course_instance = Course(
        title=course_create.title,
        description=course_create.description,
        creator_id=teacher_id,
        course_pin=course_create.course_pin,
    )
    db.add(course_instance)
    db.commit()
    db.refresh(course_instance)
    return course_instance


def create_quiz_by_course_title_teacher_id(
    db: Session, quiz_create: QuizCreate, course_title: str, teacher_id: int
) -> Quiz:
    course = get_course_by_title_creator_id(db, course_title, teacher_id)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    if int(course.creator_id) != teacher_id:  # type: ignore
        raise HTTPException(
            status_code=403,
            detail='You are not authorized to create quiz in this course',
        )

    question_set = QuestionSet()
    db.add(question_set)
    db.commit()
    db.refresh(question_set)

    db_instance = Quiz(
        course_id=course.id,
        title=quiz_create.title,
        total_mark=quiz_create.total_mark,
        question_set_id=question_set.id,
    )
    db.add(db_instance)
    db.commit()
    db.refresh(db_instance)
    return db_instance


def create_test_by_course_title_teacher_id(
    db: Session, test_create: TestCreate, course_title: str, teacher_id: int
) -> Quiz:
    course = get_course_by_title_creator_id(db, course_title, teacher_id)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    if int(course.creator_id) != teacher_id:  # type: ignore
        raise HTTPException(
            status_code=403,
            detail='You are not authorized to create quiz in this course',
        )

    question_set = QuestionSet()
    db.add(question_set)
    db.commit()
    db.refresh(question_set)

    db_instance = Test(
        course_id=course.id,
        title=test_create.title,
        total_mark=test_create.total_mark,
        question_set_id=question_set.id,
        duration=test_create.duration,
        time_window_start=test_create.time_window_start,
        time_window_end=test_create.time_window_end,
    )
    db.add(db_instance)
    db.commit()
    db.refresh(db_instance)
    return db_instance


def create_question_by_course_title_quiz_id_teacher_id(
    db: Session,
    question_create: QuestionTeacherView,
    course_title: str,
    quiz_id: int,
    teacher_id: int,
) -> Question:
    course = get_course_by_title_creator_id(db, course_title, teacher_id)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    quiz = get_quiz_by_course_title_creator_id_quiz_id(
        db, course_title, teacher_id, quiz_id
    )
    if quiz is None:
        raise HTTPException(status_code=404, detail='Quiz not found in this course')

    question_set = get_question_set_by_quiz_id(db, quiz_id)

    question_instance = Question(
        question_type=question_create.question_type,
        question_data=question_create.question_data.model_dump(),
        tag=question_create.tag,
        question_set_id=question_set.id,
        image=question_create.image,
    )

    db.add(question_instance)
    db.commit()
    return question_instance


def create_question_by_course_title_test_id_teacher_id(
    db: Session,
    question_create: QuestionTeacherView,
    course_title: str,
    test_id: int,
    teacher_id: int,
) -> Question:
    course = get_course_by_title_creator_id(db, course_title, teacher_id)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    test = get_test_by_course_title_creator_id_test_id(
        db, course_title, teacher_id, test_id
    )
    print(test)
    if test is None:
        raise HTTPException(status_code=404, detail='Test not found in this course')

    question_set = get_question_set_by_test_id(db, test_id)

    question_instance = Question(
        question_type=question_create.question_type,
        question_data=question_create.question_data.model_dump(),
        tag=question_create.tag,
        question_set_id=question_set.id,
        image=question_create.image,
    )

    db.add(question_instance)
    db.commit()
    return question_instance


# helper functions


def get_quiz_by_course_title_creator_id_quiz_id(
    db: Session, course_title: str, teacher_id: int, quiz_id: int
):
    return (
        db.query(Quiz)
        .join(Course)
        .filter(
            Course.title == course_title,
            Course.creator_id == teacher_id,
            Quiz.id == quiz_id,
        )
        .first()
    )


def get_test_by_course_title_creator_id_test_id(
    db: Session, course_title: str, teacher_id: int, test_id: int
):
    return (
        db.query(Test)
        .join(Course)
        .filter(
            Course.title == course_title,
            Course.creator_id == teacher_id,
            Test.id == test_id,
        )
        .first()
    )


def get_question_set_by_quiz_id(db: Session, quiz_id: int):
    question_set = db.query(QuestionSet).join(Quiz).filter(Quiz.id == quiz_id).first()
    if question_set is None:
        raise HTTPException(status_code=404, detail='Question set not found')
    return question_set


def get_question_set_by_test_id(db: Session, test_id: int):
    question_set = db.query(QuestionSet).join(Test).filter(Test.id == test_id).first()
    if question_set is None:
        raise HTTPException(status_code=404, detail='Question set not found')
    return question_set


def get_course_by_title_creator_id(db: Session, course_title: str, teacher_id: int):
    course = (
        db.query(Course)
        .filter(Course.title == course_title, Course.creator_id == teacher_id)
        .first()
    )
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    return course


# get or HTTPEXception

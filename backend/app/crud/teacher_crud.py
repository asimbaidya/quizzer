from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.crud.ensure import ensure_question_submissions
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
from app.schemas.progress import StudentQuizProgress, StudentTestProgress
from app.schemas.question import QuestionTeacherView
from app.schemas.request_model import CourseCreate, QuizCreate, TestCreate


def get_courses(db: Session, creator_id: int) -> list[Course]:
    return db.query(Course).filter(Course.creator_id == creator_id).all()


def get_quiz_and_test(  # type: ignore
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
        quiz.url = f'/course/quiz/{course_title}/{quiz.id}'

    # Create URLs for tests
    for test in tests:
        test.url = f'/course/test/{course_title}/{test.id}'

    return {
        'quizzes': quizzes,
        'tests': tests,
    }  # type: ignore


def get_enrolled_students(db: Session, course_title: str, teacher_id: int):
    return (
        db.query(User)
        .join(Enrollment, User.id == Enrollment.student_id)
        .join(Course, Enrollment.course_id == Course.id)
        .filter(
            Course.title == course_title,
            User.id == Enrollment.student_id,
            Course.creator_id == teacher_id,
        )
        .all()
    )


def get_questions_in_quiz(
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


def get_questions_in_test(  # type: ignore
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
    # return questions
    return {
        'questions': questions,
        'test': test,
    }  # type: ignore


def get_student_progress_in_quiz(
    db: Session, course_title: str, quiz_id: int, teacher_id: int
):
    # Fetch the quiz
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail='Quiz not found')

    question_set = (
        db.query(QuestionSet).filter(QuestionSet.id == quiz.question_set_id).first()
    )
    if question_set is None:
        raise HTTPException(status_code=404, detail='Question set not found')

    enrolled_students = (
        db.query(User)
        .join(Enrollment, Enrollment.student_id == User.id)
        .join(Course, Enrollment.course_id == Course.id)
        .filter(Course.title == course_title, Course.creator_id == teacher_id)
        .all()
    )
    for student in enrolled_students:
        print(student)
        ensure_question_submissions(db, question_set.id, student.id)

    # Fetch the total possible marks for the quiz
    total_possible_marks = (
        db.query(func.sum(Question.total_marks))
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .filter(QuestionSet.id == quiz.question_set_id)
        .scalar()
    )

    # Fetch the total number of questions in the quiz
    total_questions = (
        db.query(func.count(Question.id))
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .filter(QuestionSet.id == quiz.question_set_id)
        .scalar()
    )

    # Query to get student progress
    student_progress = (
        db.query(
            User.id.label('student_id'),
            User.email.label('email'),
            func.sum(QuestionSubmission.score)
            .filter(QuestionSubmission.score != None)  # noqa: E711
            .label('received_marks'),
            func.count(QuestionSubmission.id)
            .filter(QuestionSubmission.made_attempt == True)  # noqa: E712
            .label('total_attempts'),
            func.sum(QuestionSubmission.attempt_count)
            .filter(QuestionSubmission.made_attempt == True)  # noqa: E712
            .label('total_questions_attempted'),
        )
        .join(QuestionSubmission, QuestionSubmission.user_id == User.id)
        .join(Enrollment, User.id == Enrollment.student_id)
        .join(Course, Enrollment.course_id == Course.id)
        .join(Question, Question.id == QuestionSubmission.question_id)
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .join(Quiz, Quiz.question_set_id == QuestionSet.id)
        .filter(
            Course.title == course_title,
            Quiz.id == quiz_id,
            Course.creator_id == teacher_id,
        )
        .group_by(User.id, User.email)
        .all()
    )

    results: list[StudentQuizProgress] = []
    for sp in student_progress:
        result = {  # type: ignore
            'quiz_total_mark': quiz.total_mark,
            'student_id': sp.student_id,
            'email': sp.email,
            'received_marks': sp.received_marks if sp.received_marks else 0,
            'total_attempts': sp.total_attempts,
            'total_questions_attempted': sp.total_questions_attempted
            if sp.total_questions_attempted
            else 0,
            'total_possible_marks': total_possible_marks,
            'total_questions': total_questions,
            'weighted_marks': (sp.received_marks / total_possible_marks)
            * quiz.total_mark
            if sp.received_marks
            else 0,
            'is_unlimited_attempt': quiz.is_unlimited_attempt,
            'total_allowed_attempt': quiz.allowed_attempt,
        }

        progress = StudentQuizProgress(
            quiz_total_mark=result['quiz_total_mark'],  # type: ignore
            student_id=result['student_id'],  # type: ignore
            email=result['email'],  # type: ignore
            received_marks=result['received_marks'],  # type: ignore
            total_attempts=result['total_attempts'],  # type: ignore
            total_questions_attempted=result['total_questions_attempted'],  # type: ignore
            total_possible_marks=result['total_possible_marks'],  # type: ignore
            total_questions=result['total_questions'],  # type: ignore
            weighted_marks=result['weighted_marks'],  # type: ignore
            is_unlimited_attempt=result['is_unlimited_attempt'],  # type: ignore
            total_allowed_attempt=result['total_allowed_attempt'],  # type: ignore
        )
        results.append(progress)

    return results


def get_student_progress_in_test(
    db: Session, course_title: str, test_id: int, teacher_id: int
):
    # Fetch the test
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail='Test not found')

    question_set = (
        db.query(QuestionSet).filter(QuestionSet.id == test.question_set_id).first()
    )
    if question_set is None:
        raise HTTPException(status_code=404, detail='Question set not found')

    enrolled_students = (
        db.query(User)
        .join(Enrollment, Enrollment.student_id == User.id)
        .join(Course, Enrollment.course_id == Course.id)
        .filter(Course.title == course_title, Course.creator_id == teacher_id)
        .all()
    )
    for student in enrolled_students:
        print(student)
        ensure_question_submissions(db, question_set.id, student.id)

    # fetch the total possible marks for the test
    total_possible_marks = (
        db.query(func.sum(Question.total_marks))
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .filter(QuestionSet.id == test.question_set_id)
        .scalar()
    )

    # fetch the total number of questions in the test
    total_questions = (
        db.query(func.count(Question.id))
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .filter(QuestionSet.id == test.question_set_id)
        .scalar()
    )

    # Query to get student progress
    student_progress = (
        db.query(
            User.id.label('student_id'),
            User.email.label('email'),
            func.sum(QuestionSubmission.score)
            .filter(QuestionSubmission.score != None)  # noqa: E711
            .label('received_marks'),
            func.count(QuestionSubmission.id)
            .filter(QuestionSubmission.made_attempt == True)  # noqa: E712
            .label('total_attempts'),
            func.sum(QuestionSubmission.attempt_count)
            .filter(QuestionSubmission.made_attempt == True)  # noqa: E712
            .label('total_questions_attempted'),
        )
        .join(QuestionSubmission, QuestionSubmission.user_id == User.id)
        .join(Enrollment, User.id == Enrollment.student_id)
        .join(Course, Enrollment.course_id == Course.id)
        .join(Question, Question.id == QuestionSubmission.question_id)
        .join(QuestionSet, QuestionSet.id == Question.question_set_id)
        .join(Test, Test.question_set_id == QuestionSet.id)
        .filter(
            Course.title == course_title,
            Test.id == test_id,
            Course.creator_id == teacher_id,
        )
        .group_by(User.id, User.email)
        .all()
    )

    # Format the result into a list of dictionaries
    results: list[StudentTestProgress] = []
    for sp in student_progress:
        result = {  # type: ignore
            'Test_mark': test.total_mark,
            'student_id': sp.student_id,
            'email': sp.email,
            'received_marks': sp.received_marks if sp.received_marks else 0,
            'total_attempts': sp.total_attempts,
            'total_questions_attempted': sp.total_questions_attempted
            if sp.total_questions_attempted
            else 0,
            'total_possible_marks': total_possible_marks,
            'total_questions': total_questions,
            'weighted_marks': (sp.received_marks / total_possible_marks)
            * test.total_mark
            if sp.received_marks
            else 0,
        }

        progress = StudentTestProgress(
            test_total_mark=result['Test_mark'],  # type: ignore
            student_id=result['student_id'],  # type: ignore
            email=result['email'],  # type: ignore
            received_marks=result['received_marks'],  # type: ignore
            total_attempts=result['total_attempts'],  # type: ignore
            total_questions_attempted=result['total_questions_attempted'],  # type: ignore
            total_possible_marks=result['total_possible_marks'],  # type: ignore
            total_questions=result['total_questions'],  # type: ignore
            weighted_marks=result['weighted_marks'],  # type: ignore
        )  # type: ignore
        results.append(progress)

    return results


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


def create_quiz(
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
        # bug-fix
        is_unlimited_attempt=quiz_create.is_unlimited_attempt,
        allowed_attempt=quiz_create.allowed_attempt,
    )
    db.add(db_instance)
    db.commit()
    db.refresh(db_instance)
    return db_instance


def create_test(
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
        window_start=test_create.window_start,
        window_end=test_create.window_end,
    )
    db.add(db_instance)
    db.commit()
    db.refresh(db_instance)
    return db_instance


def create_question_in_quiz(
    db: Session,
    question_create: QuestionTeacherView,
    course_title: str,
    quiz_id: int,
    teacher_id: int,
):
    course = get_course_by_title_creator_id(db, course_title, teacher_id)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    quiz = get_quiz(db, course_title, teacher_id, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail='Quiz not found in this course')

    question_set = get_question_set_by_quiz_id(db, quiz_id)

    question_instance = Question(
        question_type=question_create.question_type,
        question_data=question_create.question_data.model_dump(),
        tag=question_create.tag,
        question_set_id=question_set.id,
        image=question_create.image,
        total_marks=question_create.total_marks,
    )

    db.add(question_instance)
    db.commit()
    return {'detail': 'Question Created Successfullly'}


def create_question_in_test(
    db: Session,
    question_create: QuestionTeacherView,
    course_title: str,
    test_id: int,
    teacher_id: int,
):
    course = get_course_by_title_creator_id(db, course_title, teacher_id)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    test = get_test(db, course_title, teacher_id, test_id)
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
        total_marks=question_create.total_marks,
    )

    db.add(question_instance)
    db.commit()
    return {'detail': 'Question Created Successfullly'}


# helper functions


def get_quiz(db: Session, course_title: str, teacher_id: int, quiz_id: int):
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


def get_test(db: Session, course_title: str, teacher_id: int, test_id: int):
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

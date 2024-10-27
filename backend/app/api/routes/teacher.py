from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentTeacher, SessionDep
from app.crud import course_crud, question_crud, quiz_crud
from app.schemas.course import CourseCreate
from app.schemas.question import QuestionCreate
from app.schemas.quiz import QuizCreate

router = APIRouter()

# get
# /courses [get list of courses]
# course/{course_title}/{quiz_id} [get quiz Questions of a quiz]
# course/{course_title}/{quiz_id}/{question_id}/answer [get answer]

# course/{course_title}/info [list of enrolled students]
# course/{course_title}/{quiz_id}/info [student progress] ]

# post
# /course [create course]
# /course/{course_title}/ [create quiz]
# /course/{course_title}/{quiz_id} [create question] [publish_quiz] [edit_quiz_details]


@router.post('/course')
def create_course(
    db: SessionDep,
    course: CourseCreate,
    teacher: CurrentTeacher,
):
    try:
        new_course = course_crud.create_course(
            db,
            course_create=course,
            creator_id=teacher.id,  # type: ignore
        )
        return new_course
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get('/course/{course_title}')
def get_course_outline_by_title(db: SessionDep, course_title: str):  # type: ignore
    course = course_crud.get_course_by_title(db, course_title)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    quizzes = quiz_crud.get_quizzes_by_course_id(db, course.id)  # type: ignore
    return {
        'course': course,
        'quizzes': quizzes,
    }  # type: ignore


@router.post('/quiz')
def create_quiz(db: SessionDep, quiz: QuizCreate, teacher: CurrentTeacher):
    try:
        course_creator_id = course_crud.get_course_creator_id(db, quiz.course_id)
        if course_creator_id is None:
            return HTTPException(
                status_code=400,
                detail='Course with this ID does not exist',
            )
        if course_creator_id != teacher.id:
            return HTTPException(
                status_code=403,
                detail='You are not the creator of this course',
            )

        new_quiz = quiz_crud.create_quiz(db, quiz_create=quiz)

        return new_quiz

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get('/{course_title}/{quiz_id}')
def get_quiz_by_id(
    db: SessionDep, course_title: str, quiz_id: int, teacher: CurrentTeacher
):
    print(f'{teacher} and {course_title} and {quiz_id}')
    course = course_crud.get_course_by_title(db, course_title)
    if course is None:
        raise HTTPException(status_code=404, detail='Course not found')
    quiz = quiz_crud.get_quiz_by_id(db, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail='Quiz not found')

    questions = question_crud.get_questions_by_quiz_id(db, quiz_id)
    return questions


@router.post('/question/{course_title}/{quiz_id}')
def create_question(db: SessionDep, question: QuestionCreate, teacher: CurrentTeacher):
    try:
        quiz = quiz_crud.get_quiz_by_id(db, question.quiz_id)
        if quiz is None:
            return HTTPException(
                status_code=400,
                detail='Quiz with this ID does not exist',
            )

        course_creator_id = course_crud.get_course_creator_id(db, quiz.course_id)  # type: ignore
        if course_creator_id is None:
            return HTTPException(
                status_code=400,
                detail='Course with this ID does not exist',
            )
        if course_creator_id != teacher.id:
            return HTTPException(
                status_code=403,
                detail='You are not the creator of this course',
            )

        new_question = question_crud.create_question(db, question_create=question)
        return new_question
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

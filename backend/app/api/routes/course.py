from fastapi import APIRouter, HTTPException
from app.schemas.course import CourseCreate
from app.crud import course_crud, quiz_crud
from app.api.deps import CurrentTeacher, SessionDep

router = APIRouter()


@router.post("/")
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


@router.get("/{course_title}")
def get_course_outline_by_title(db: SessionDep, course_title: str):  # type: ignore
    course = course_crud.get_course_by_title(db, course_title)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    quizzes = quiz_crud.get_quizzes_by_course_id(db, course.id)  # type: ignore
    return {
        "course": course,
        "quizzes": quizzes,
    }  # type: ignore

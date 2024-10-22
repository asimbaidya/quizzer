from fastapi import APIRouter
from app.schemas.course import CourseCreate
from app.crud import course_crud
from app.api.deps import CurrentTeacher, SessionDep


router = APIRouter()


@router.post("/courses")
def create_course(
    db: SessionDep,
    course: CourseCreate,
    teacher: CurrentTeacher,
):
    print(course)
    new_course = course_crud.create_course(
        db, course_create=course, creator_id=teacher.id
    )
    return {"course": new_course}

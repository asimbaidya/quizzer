from fastapi import APIRouter
from app.schemas.course import CourseCreate
from app.crud import course_crud
from app.api.deps import CurrentTeacher, SessionDep

router = APIRouter()


@router.post("/")
def create_course(
    db: SessionDep,
    course: CourseCreate,
    teacher: CurrentTeacher,
):
    try:
        print(course.model_dump())
        new_course = course_crud.create_course(
            db,
            course_create=course,
            creator_id=teacher.id,  # type: ignore
        )
        return {"course": new_course}
    except Exception as e:
        return {"msg": "An error occurred", "error": str(e)}

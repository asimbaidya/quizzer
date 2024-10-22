from fastapi import APIRouter, HTTPException
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
        new_course = course_crud.create_course(
            db,
            course_create=course,
            creator_id=teacher.id,  # type: ignore
        )
        return new_course
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

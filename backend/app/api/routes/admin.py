import os

from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentAdmin, SessionDep
from app.core.config import settings
from app.crud import user_crud
from app.models.quiz import Question
from app.schemas.user import UserCreate

router = APIRouter()


@router.get('/')
def home():
    return {'message': 'Hello, World From Admin!'}


@router.get('/delete_unused_images')
def delete_unused_images(db: SessionDep, _admin: CurrentAdmin):
    image_dir = settings.UPLOAD_DIRECTORY

    # get all files in the upload directory
    all_files = set(os.listdir(image_dir))

    questions = db.query(Question).filter(Question.image != None).all()  # noqa: E711

    used_files = {question.image for question in questions if question.image}
    unused_files = all_files - used_files

    for file_name in unused_files:
        file_path = os.path.join(image_dir, file_name)
        try:
            os.remove(file_path)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f'Error deleting file {file_name}: {e!s}'
            )

    success = len(unused_files) != 0
    if success:
        detail = f'Deleted {len(unused_files)} unused images'
    else:
        detail = 'No File to Delete'

    return {'success': success, 'detail': detail}


@router.post('/users')
def add_user(db: SessionDep, _admin: CurrentAdmin, user: UserCreate):
    try:
        existing_user = user_crud.get_user_by_email(db, email=user.email)

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail='The user with this email already exists in the system',
            )
        return user_crud.create_user(db, user_create=user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

import os
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.api.deps import CurrentTeacher, CurrentUser
from app.core.config import settings

router = APIRouter()


@router.post('/image_upload/')
async def upload_image(_current_teacher: CurrentTeacher, file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail='File name/extention is missing.')

    unique_filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    file_location = os.path.join(settings.UPLOAD_DIRECTORY, unique_filename)

    with open(file_location, 'wb') as buffer:
        buffer.write(await file.read())

    return {'file_id': unique_filename}


@router.get('/image_show/{filename}')
async def show_image(_current_user: CurrentUser, filename: str):
    file_path = os.path.join(settings.UPLOAD_DIRECTORY, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail='File not found.')
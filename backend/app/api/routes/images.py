import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.api.deps import CurrentUser
from app.core.config import settings

router = APIRouter(prefix="/images", tags=["images"])

# Extensions we accept for uploaded question/note images.
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp"}


@router.post("/upload")
async def upload_image(_: CurrentUser, file: UploadFile = File(...)) -> dict[str, str]:
    """Upload an image; returns the stored filename to reference on a question/note."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is missing")
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{ext}"
    destination = os.path.join(settings.UPLOAD_DIRECTORY, filename)
    with open(destination, "wb") as buffer:
        buffer.write(await file.read())
    return {"file_id": filename}


@router.get("/show/{filename}")
async def show_image(filename: str) -> FileResponse:
    # Guard against path traversal: only allow a bare filename.
    if Path(filename).name != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    file_path = os.path.join(settings.UPLOAD_DIRECTORY, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

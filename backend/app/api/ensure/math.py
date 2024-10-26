from fastapi import HTTPException


def ensure_math(num_one: int, num_two: int):
    if num_one != num_two:
        raise HTTPException(status_code=400, detail="Can not Ensure Permissino")

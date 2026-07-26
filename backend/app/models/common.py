from datetime import UTC, datetime

from sqlmodel import Field, SQLModel


def get_datetime_utc() -> datetime:
    """Timezone-aware UTC now, used as a default factory for timestamp columns."""
    return datetime.now(UTC)


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing an access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of a JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)

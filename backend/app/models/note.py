from sqlalchemy import (
    Column,
    Integer,
    String,
    TIMESTAMP,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.core.db import Base


class Note(Base):
    __tablename__ = "note"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False, default="Untitled")
    note_data = Column(JSONB, nullable=False)  # Store question details as JSONB

    creator = relationship("User", back_populates="course")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
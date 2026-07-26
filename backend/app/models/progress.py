import uuid

from sqlmodel import SQLModel


class StudentQuizProgress(SQLModel):
    quiz_total_mark: int
    student_id: uuid.UUID
    email: str
    received_marks: float
    total_attempts: int
    total_questions_attempted: int
    total_possible_marks: float
    total_questions: int
    weighted_marks: float
    is_unlimited_attempt: bool
    total_allowed_attempt: int


class StudentTestProgress(SQLModel):
    test_total_mark: int
    student_id: uuid.UUID
    email: str
    received_marks: float
    total_attempts: int
    total_questions_attempted: int
    total_possible_marks: float
    total_questions: int
    weighted_marks: float

from pydantic import BaseModel, ConfigDict


class StudentQuizProgress(BaseModel):
    quiz_total_mark: int
    student_id: int
    email: str
    received_marks: float
    total_attempts: int
    total_questions_attempted: int
    total_possible_marks: float
    total_questions: int
    weighted_marks: float
    is_unlimited_attempt: bool
    total_allowed_attempt: int

    model_config = ConfigDict(from_attributes=True)


class StudentTestProgress(BaseModel):
    test_total_mark: int
    student_id: int
    email: str
    received_marks: float
    total_attempts: int
    total_questions_attempted: int
    total_possible_marks: float
    total_questions: int
    weighted_marks: float

    model_config = ConfigDict(from_attributes=True)

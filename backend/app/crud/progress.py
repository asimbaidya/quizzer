import uuid

from sqlmodel import Session, select

from app.crud.course import get_enrolled_students
from app.crud.quiz import get_teacher_quiz, get_teacher_test
from app.crud.submission import ensure_question_submissions
from app.models import Question, QuestionSubmission, User
from app.models.progress import StudentQuizProgress, StudentTestProgress


def _question_set_totals(
    session: Session, question_set_id: uuid.UUID
) -> tuple[int, int]:
    questions = session.exec(
        select(Question).where(Question.question_set_id == question_set_id)
    ).all()
    total_possible_marks = sum(q.total_marks for q in questions)
    return total_possible_marks, len(questions)


def _student_aggregate(
    session: Session, question_set_id: uuid.UUID, student_id: uuid.UUID
) -> tuple[float, int, int]:
    """Return (received_marks, total_attempts, total_questions_attempted)."""
    submissions = session.exec(
        select(QuestionSubmission)
        .join(Question, QuestionSubmission.question_id == Question.id)  # type: ignore[arg-type]
        .where(
            Question.question_set_id == question_set_id,
            QuestionSubmission.user_id == student_id,
        )
    ).all()
    received = sum(s.score or 0 for s in submissions)
    attempted = [s for s in submissions if s.made_attempt]
    total_attempts = len(attempted)
    total_questions_attempted = sum(s.attempt_count for s in attempted)
    return received, total_attempts, total_questions_attempted


def get_quiz_progress(
    session: Session, course_title: str, quiz_id: uuid.UUID, teacher_id: uuid.UUID
) -> list[StudentQuizProgress]:
    quiz = get_teacher_quiz(session, course_title, teacher_id, quiz_id)
    total_possible, total_questions = _question_set_totals(
        session, quiz.question_set_id
    )
    students = get_enrolled_students(session, course_title, teacher_id)

    results: list[StudentQuizProgress] = []
    for student in students:
        ensure_question_submissions(session, quiz.question_set_id, student.id)
        received, attempts, attempted = _student_aggregate(
            session, quiz.question_set_id, student.id
        )
        weighted = (
            (received / total_possible * quiz.total_mark) if total_possible else 0
        )
        results.append(
            StudentQuizProgress(
                quiz_total_mark=quiz.total_mark,
                student_id=student.id,
                email=student.email,
                received_marks=received,
                total_attempts=attempts,
                total_questions_attempted=attempted,
                total_possible_marks=total_possible,
                total_questions=total_questions,
                weighted_marks=weighted,
                is_unlimited_attempt=quiz.is_unlimited_attempt,
                total_allowed_attempt=quiz.allowed_attempt,
            )
        )
    return results


def get_test_progress(
    session: Session, course_title: str, test_id: uuid.UUID, teacher_id: uuid.UUID
) -> list[StudentTestProgress]:
    test = get_teacher_test(session, course_title, teacher_id, test_id)
    total_possible, total_questions = _question_set_totals(
        session, test.question_set_id
    )
    students: list[User] = get_enrolled_students(session, course_title, teacher_id)

    results: list[StudentTestProgress] = []
    for student in students:
        ensure_question_submissions(session, test.question_set_id, student.id)
        received, attempts, attempted = _student_aggregate(
            session, test.question_set_id, student.id
        )
        weighted = (
            (received / total_possible * test.total_mark) if total_possible else 0
        )
        results.append(
            StudentTestProgress(
                test_total_mark=test.total_mark,
                student_id=student.id,
                email=student.email,
                received_marks=received,
                total_attempts=attempts,
                total_questions_attempted=attempted,
                total_possible_marks=total_possible,
                total_questions=total_questions,
                weighted_marks=weighted,
            )
        )
    return results

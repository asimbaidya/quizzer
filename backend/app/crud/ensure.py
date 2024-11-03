from sqlalchemy.orm import Session

from app.models.quiz import Question, QuestionSubmission


def ensure_question_submissions(db: Session, question_set_id: int, student_id: int):
    # fetch the questions for the test
    questions = (
        db.query(Question).filter(Question.question_set_id == question_set_id).all()
    )

    # create userquestionsubmission for each question if not already exists
    for question in questions:
        user_question_submission = (
            db.query(QuestionSubmission)
            .filter(
                QuestionSubmission.question_id == question.id,
                QuestionSubmission.user_id == student_id,
            )
            .first()
        )

        if not user_question_submission:
            user_question_submission = QuestionSubmission(
                question_id=question.id,
                user_id=student_id,
                attempt_count=0,
                score=None,
                feedback=None,
                is_correct=None,
                question_type=question.question_type,
                made_attempt=False,
            )
            db.add(user_question_submission)

    db.commit()

"""Unit tests for the auto-marking logic (no database required)."""

import pytest

from app.marking import mark_submission
from app.models.enums import QuestionType
from app.models.payloads import QuestionStudentResponse, QuestionTeacherData


def _teacher(**kw) -> QuestionTeacherData:
    return QuestionTeacherData(**kw)


def _resp(qtype: QuestionType, value) -> QuestionStudentResponse:
    return QuestionStudentResponse(question_type=qtype, user_response=value)


def test_single_choice_correct():
    q = _teacher(
        question_type=QuestionType.SINGLE_CHOICE,
        question_text="2+2?",
        choices=[
            {"text": "3", "correct": False},
            {"text": "4", "correct": True},
            {"text": "5", "correct": False},
            {"text": "6", "correct": False},
        ],
    )
    r = mark_submission(
        question_data=q,
        total_marks=10,
        response=_resp(QuestionType.SINGLE_CHOICE, "4"),
    )
    assert r.is_correct and r.score == 10


def test_single_choice_wrong():
    q = _teacher(
        question_type=QuestionType.SINGLE_CHOICE,
        question_text="2+2?",
        choices=[
            {"text": "3", "correct": False},
            {"text": "4", "correct": True},
            {"text": "5", "correct": False},
            {"text": "6", "correct": False},
        ],
    )
    r = mark_submission(
        question_data=q, total_marks=10, response=_resp(QuestionType.SINGLE_CHOICE, "3")
    )
    assert not r.is_correct and r.score == 0


def test_multiple_choice_exact_match():
    q = _teacher(
        question_type=QuestionType.MULTIPLE_CHOICE,
        question_text="pick primes",
        choices=[
            {"text": "2", "correct": True},
            {"text": "3", "correct": True},
            {"text": "4", "correct": False},
            {"text": "9", "correct": False},
        ],
    )
    r = mark_submission(
        question_data=q,
        total_marks=8,
        response=_resp(QuestionType.MULTIPLE_CHOICE, ["2", "3"]),
    )
    assert r.is_correct and r.score == 8


def test_multiple_choice_partial_is_zero():
    q = _teacher(
        question_type=QuestionType.MULTIPLE_CHOICE,
        question_text="pick primes",
        choices=[
            {"text": "2", "correct": True},
            {"text": "3", "correct": True},
            {"text": "4", "correct": False},
            {"text": "9", "correct": False},
        ],
    )
    r = mark_submission(
        question_data=q,
        total_marks=8,
        response=_resp(QuestionType.MULTIPLE_CHOICE, ["2"]),
    )
    assert not r.is_correct and r.score == 0
    assert "Partially correct" in r.feedback


def test_true_false():
    q = _teacher(
        question_type=QuestionType.TRUE_FALSE,
        question_text="sky is blue",
        true_false_answer=True,
    )
    assert mark_submission(
        question_data=q, total_marks=5, response=_resp(QuestionType.TRUE_FALSE, True)
    ).is_correct
    assert not mark_submission(
        question_data=q, total_marks=5, response=_resp(QuestionType.TRUE_FALSE, False)
    ).is_correct


def test_user_input_is_trimmed():
    q = _teacher(
        question_type=QuestionType.USER_INPUT,
        question_text="capital of France",
        correct_answer="Paris",
    )
    assert mark_submission(
        question_data=q,
        total_marks=5,
        response=_resp(QuestionType.USER_INPUT, "  Paris "),
    ).is_correct


@pytest.mark.parametrize(
    "choices",
    [
        # single choice with two correct answers
        [
            {"text": "a", "correct": True},
            {"text": "b", "correct": True},
            {"text": "c", "correct": False},
            {"text": "d", "correct": False},
        ],
        # fewer than 4 choices
        [{"text": "a", "correct": True}, {"text": "b", "correct": False}],
    ],
)
def test_invalid_single_choice_rejected(choices):
    with pytest.raises(ValueError):
        _teacher(
            question_type=QuestionType.SINGLE_CHOICE,
            question_text="bad",
            choices=choices,
        )

from enum import StrEnum


class QuestionType(StrEnum):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    USER_INPUT = "user_input"
    TRUE_FALSE = "true_false"


class SubmissionStatus(StrEnum):
    VIEWED = "viewed"
    SUBMITTED = "submitted"


class TestStatus(StrEnum):
    """Logical test lifecycle status. Computed at request time, never stored."""

    NOT_OPENED = "not_opened"  # start of the window has not been reached
    NOT_STARTED = "not_started"  # student has not started the test yet
    IN_PROGRESS = "in_progress"  # student is currently taking the test
    IN_WAITING_FOR_RESULT = "in_waiting_for_result"  # ended, window still open
    COMPLETED = "completed"  # student has completed the test
    NOT_PARTICIPATED = "not_participated"  # window closed, never participated

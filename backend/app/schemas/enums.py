from enum import Enum


class TestStatus(str, Enum):
    # logical status(not stored in db )
    NOT_OPENED = 'not_opened'  # start window has is not reached
    NOT_STARTED = 'not_started'  # student has not started the test
    IN_PROGRESS = 'in_progress'  # student is currently taking the test duration left
    IN_WAITING_FOR_RESULT = (
        'in_waiting_for_result'
        # test has ended and waiting for window to close
    )
    COMPLETED = 'completed'  # student has completed the test
    NOT_PARTICIPATED = (
        'not_participated'
        # student has not participated in the test and test ended
        # this type of tests won't be visible to student
    )


class UserRole(str, Enum):
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'


class QuestionType(str, Enum):
    SINGLE_CHOICE = 'single_choice'
    MULTIPLE_CHOICE = 'multiple_choice'
    USER_INPUT = 'user_input'
    TRUE_FALSE = 'true_false'


class SubmissionStatus(str, Enum):
    VIEWED = 'viewed'
    SUBMITTED = 'submitted'

from enum import Enum


class TestStatus(str, Enum):
    NOT_OPENED = 'not_opened'  # start window has is not reached
    NOT_STARTED = 'not_started'  # student has not started the test
    IN_PROGRESS = 'in_progress'  # student is currently taking the test duration left
    COMPLETED = 'completed'  # student has completed the test


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

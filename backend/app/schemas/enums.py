from enum import Enum


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

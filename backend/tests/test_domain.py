from fastapi.testclient import TestClient

from tests.helpers import API, create_user, rand

SINGLE_CHOICE_Q = {
    "question_type": "single_choice",
    "question_data": {
        "question_type": "single_choice",
        "question_text": "2 + 2 = ?",
        "choices": [
            {"text": "3", "correct": False},
            {"text": "4", "correct": True},
            {"text": "5", "correct": False},
            {"text": "6", "correct": False},
        ],
    },
    "total_marks": 10,
    "tag": "arith",
}


def _make_course_with_quiz(client, teacher_headers):
    title = rand("Course_")
    r = client.post(
        f"{API}/teacher/course",
        headers=teacher_headers,
        json={"title": title, "description": "d"},
    )
    assert r.status_code == 200, r.text
    pin = r.json()["course_pin"]
    r = client.post(
        f"{API}/teacher/course/quiz/{title}",
        headers=teacher_headers,
        json={"title": "Q1", "total_mark": 10, "allowed_attempt": 2},
    )
    assert r.status_code == 200, r.text
    quiz = r.json()
    r = client.post(
        f"{API}/teacher/course/quiz/{title}/{quiz['id']}",
        headers=teacher_headers,
        json=SINGLE_CHOICE_Q,
    )
    assert r.status_code == 200, r.text
    return title, pin, quiz["id"], quiz["question_set_id"]


def test_full_quiz_flow(client: TestClient, superuser_token_headers):
    _, _, teacher = create_user(client, superuser_token_headers, "teacher")
    s_email, _, student = create_user(client, superuser_token_headers, "student")
    title, pin, quiz_id, qset_id = _make_course_with_quiz(client, teacher)

    # enroll
    r = client.post(
        f"{API}/student/enrolled_courses",
        headers=student,
        json={"course_title": title, "course_pin": pin},
    )
    assert r.status_code == 200, r.text

    # view quiz -> answers stripped
    r = client.get(
        f"{API}/student/enrolled_courses/quiz/{title}/{quiz_id}", headers=student
    )
    assert r.status_code == 200, r.text
    qs = r.json()["question_submissions"]
    assert len(qs) == 1
    choices = qs[0]["question"]["question_data"]["choices"]
    assert all("correct" not in c for c in choices)
    qid = qs[0]["question"]["id"]

    # submit correct
    payload = {
        "question_type": "single_choice",
        "user_response": {"question_type": "single_choice", "user_response": "4"},
    }
    r = client.post(
        f"{API}/student/questions/submit/{qid}",
        headers=student,
        params={"course_title": title, "question_set_id": qset_id},
        json=payload,
    )
    assert r.status_code == 200, r.text
    assert r.json()["is_correct"] is True
    assert r.json()["score"] == 10

    # second attempt (wrong), then third blocked (allowed_attempt=2)
    wrong = {
        "question_type": "single_choice",
        "user_response": {"question_type": "single_choice", "user_response": "3"},
    }
    r = client.post(
        f"{API}/student/questions/submit/{qid}",
        headers=student,
        params={"course_title": title, "question_set_id": qset_id},
        json=wrong,
    )
    assert r.status_code == 200 and r.json()["is_correct"] is False
    r = client.post(
        f"{API}/student/questions/submit/{qid}",
        headers=student,
        params={"course_title": title, "question_set_id": qset_id},
        json=payload,
    )
    assert r.status_code == 403  # max attempts

    # teacher sees progress
    r = client.get(
        f"{API}/teacher/course/quiz/students/{title}/{quiz_id}", headers=teacher
    )
    assert r.status_code == 200, r.text
    rows = r.json()
    assert len(rows) == 1 and rows[0]["email"] == s_email


def test_enroll_wrong_pin(client: TestClient, superuser_token_headers):
    _, _, teacher = create_user(client, superuser_token_headers, "teacher")
    _, _, student = create_user(client, superuser_token_headers, "student")
    title, _, _, _ = _make_course_with_quiz(client, teacher)
    r = client.post(
        f"{API}/student/enrolled_courses",
        headers=student,
        json={"course_title": title, "course_pin": "WRONG123"},
    )
    assert r.status_code == 400


def test_student_blocked_from_teacher_route(
    client: TestClient, superuser_token_headers
):
    _, _, student = create_user(client, superuser_token_headers, "student")
    r = client.get(f"{API}/teacher/courses", headers=student)
    assert r.status_code == 403


def test_invalid_question_rejected(client: TestClient, superuser_token_headers):
    _, _, teacher = create_user(client, superuser_token_headers, "teacher")
    title, _, quiz_id, _ = _make_course_with_quiz(client, teacher)
    bad = {
        **SINGLE_CHOICE_Q,
        "question_data": {
            **SINGLE_CHOICE_Q["question_data"],
            "choices": [
                {"text": "3", "correct": True},
                {"text": "4", "correct": True},
                {"text": "5", "correct": False},
                {"text": "6", "correct": False},
            ],
        },
    }
    r = client.post(
        f"{API}/teacher/course/quiz/{title}/{quiz_id}", headers=teacher, json=bad
    )
    assert r.status_code == 422

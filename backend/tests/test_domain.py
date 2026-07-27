from datetime import UTC, datetime, timedelta

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


def _make_course_with_test(client, teacher_headers, *, window_start, window_end):
    title = rand("Course_")
    r = client.post(
        f"{API}/teacher/course",
        headers=teacher_headers,
        json={"title": title, "description": "d"},
    )
    assert r.status_code == 200, r.text
    pin = r.json()["course_pin"]
    r = client.post(
        f"{API}/teacher/course/test/{title}",
        headers=teacher_headers,
        json={
            "title": "T1",
            "total_mark": 10,
            "duration": 30,
            "window_start": window_start.isoformat(),
            "window_end": window_end.isoformat(),
        },
    )
    assert r.status_code == 200, r.text
    test = r.json()
    r = client.post(
        f"{API}/teacher/course/test/{title}/{test['id']}",
        headers=teacher_headers,
        json=SINGLE_CHOICE_Q,
    )
    assert r.status_code == 200, r.text
    return title, pin, test["id"]


def _enroll(client, student_headers, title, pin):
    r = client.post(
        f"{API}/student/enrolled_courses",
        headers=student_headers,
        json={"course_title": title, "course_pin": pin},
    )
    assert r.status_code == 200, r.text


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


def _batch(qid, value):
    return {
        "answers": [
            {
                "question_id": qid,
                "question_type": "single_choice",
                "user_response": {
                    "question_type": "single_choice",
                    "user_response": value,
                },
            }
        ]
    }


def test_quiz_batch_submit(client: TestClient, superuser_token_headers):
    _, _, teacher = create_user(client, superuser_token_headers, "teacher")
    _, _, student = create_user(client, superuser_token_headers, "student")
    title, pin, quiz_id, _ = _make_course_with_quiz(client, teacher)
    _enroll(client, student, title, pin)

    r = client.get(
        f"{API}/student/enrolled_courses/quiz/{title}/{quiz_id}", headers=student
    )
    qid = r.json()["question_submissions"][0]["question"]["id"]

    # Submit the whole quiz correctly -> results returned inline.
    r = client.post(
        f"{API}/student/enrolled_courses/quiz/{title}/{quiz_id}/submit",
        headers=student,
        json=_batch(qid, "4"),
    )
    assert r.status_code == 200, r.text
    sub = r.json()["question_submissions"][0]["submission"]
    assert sub["is_correct"] is True and sub["score"] == 10

    # A second submission (allowed_attempt=2) is fine, a third is blocked.
    r = client.post(
        f"{API}/student/enrolled_courses/quiz/{title}/{quiz_id}/submit",
        headers=student,
        json=_batch(qid, "3"),
    )
    assert r.status_code == 200 and r.json()["question_submissions"][0][
        "submission"
    ]["is_correct"] is False
    r = client.post(
        f"{API}/student/enrolled_courses/quiz/{title}/{quiz_id}/submit",
        headers=student,
        json=_batch(qid, "4"),
    )
    assert r.status_code == 403


def test_test_lifecycle_and_lock(client: TestClient, superuser_token_headers):
    _, _, teacher = create_user(client, superuser_token_headers, "teacher")
    _, _, student = create_user(client, superuser_token_headers, "student")
    now = datetime.now(UTC)
    title, pin, test_id = _make_course_with_test(
        client,
        teacher,
        window_start=now - timedelta(minutes=1),
        window_end=now + timedelta(hours=1),
    )
    _enroll(client, student, title, pin)

    # Before starting: status is reported but no questions are leaked.
    r = client.get(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}", headers=student
    )
    assert r.status_code == 200, r.text
    assert r.json()["status"] == "not_started"
    assert r.json()["question_submissions"] == []

    # Cannot submit before starting.
    r = client.post(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}/submit",
        headers=student,
        json={"answers": []},
    )
    assert r.status_code == 400

    # Start -> in progress, questions visible with answers hidden.
    r = client.post(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}", headers=student
    )
    assert r.status_code == 200, r.text
    r = client.get(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}", headers=student
    )
    body = r.json()
    assert body["status"] == "in_progress"
    qid = body["question_submissions"][0]["question"]["id"]

    # Starting again is rejected (single-use).
    r = client.post(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}", headers=student
    )
    assert r.status_code == 400

    # Submit the whole test -> locked, results hidden until window closes.
    r = client.post(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}/submit",
        headers=student,
        json=_batch(qid, "4"),
    )
    assert r.status_code == 200, r.text
    assert r.json()["status"] == "in_waiting_for_result"
    assert r.json()["question_submissions"][0]["submission"]["is_correct"] is None

    # Cannot submit twice.
    r = client.post(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}/submit",
        headers=student,
        json=_batch(qid, "3"),
    )
    assert r.status_code == 400


def test_test_not_opened(client: TestClient, superuser_token_headers):
    _, _, teacher = create_user(client, superuser_token_headers, "teacher")
    _, _, student = create_user(client, superuser_token_headers, "student")
    now = datetime.now(UTC)
    title, pin, test_id = _make_course_with_test(
        client,
        teacher,
        window_start=now + timedelta(hours=1),
        window_end=now + timedelta(hours=2),
    )
    _enroll(client, student, title, pin)

    r = client.get(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}", headers=student
    )
    assert r.status_code == 200 and r.json()["status"] == "not_opened"

    # Starting before the window opens is rejected.
    r = client.post(
        f"{API}/student/enrolled_courses/test/{title}/{test_id}", headers=student
    )
    assert r.status_code == 400

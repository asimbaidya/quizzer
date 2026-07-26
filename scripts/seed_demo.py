"""Seed a realistic demo dataset via the running API and write credentials."""

import datetime as dt
import sys

import httpx

BASE = "http://127.0.0.1:8001/api/v1"
FRONTEND = "http://localhost:5173"
c = httpx.Client(base_url=BASE, timeout=30)

ADMIN = ("admin@example.com", "ChangeMe_Admin123")
TEACHER_PW = "Teacher123!"
STUDENT_PW = "Student123!"


def login(email, password):
    r = c.post("/login/access-token", data={"username": email, "password": password})
    r.raise_for_status()
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def ensure_user(admin_h, email, password, role):
    r = c.post(
        "/admin/users",
        headers=admin_h,
        json={"email": email, "password": password, "role": role},
    )
    if r.status_code == 200:
        print(f"  + {role}: {email}")
    elif r.status_code == 400:  # already exists (re-run)
        print(f"  = {role}: {email} (exists)")
    else:
        print(f"  ! {role}: {email} -> {r.status_code} {r.text[:120]}")
    return email, password


def ensure_course(teacher_h, title, description):
    r = c.post(
        "/teacher/course",
        headers=teacher_h,
        json={"title": title, "description": description},
    )
    if r.status_code == 200:
        course = r.json()
        print(f"  + course: {title} (PIN {course['course_pin']})")
        return course
    # exists -> fetch it back to read the PIN
    courses = c.get("/teacher/courses", headers=teacher_h).json()
    for course in courses:
        if course["title"] == title:
            print(f"  = course: {title} (PIN {course['course_pin']})")
            return course
    raise RuntimeError(f"could not create/find course {title}: {r.text[:150]}")


def add_quiz(teacher_h, title, course, quiz_title, total, attempts):
    r = c.post(
        f"/teacher/course/quiz/{title}",
        headers=teacher_h,
        json={"title": quiz_title, "total_mark": total, "allowed_attempt": attempts},
    )
    r.raise_for_status()
    return r.json()


def add_test(teacher_h, title, test_title, total, duration):
    now = dt.datetime.now(dt.UTC)
    r = c.post(
        f"/teacher/course/test/{title}",
        headers=teacher_h,
        json={
            "title": test_title,
            "total_mark": total,
            "duration": duration,
            "window_start": (now - dt.timedelta(hours=1)).isoformat(),
            "window_end": (now + dt.timedelta(days=7)).isoformat(),
        },
    )
    r.raise_for_status()
    return r.json()


def add_question(teacher_h, title, kind, assessment_id, q):
    path = (
        f"/teacher/course/quiz/{title}/{assessment_id}"
        if kind == "quiz"
        else f"/teacher/course/test/{title}/{assessment_id}"
    )
    r = c.post(path, headers=teacher_h, json=q)
    r.raise_for_status()


def sc(text, opts):  # single choice helper: opts = [(text, correct)]
    return {
        "question_type": "single_choice",
        "question_data": {
            "question_type": "single_choice",
            "question_text": text,
            "choices": [{"text": t, "correct": c_} for t, c_ in opts],
        },
        "total_marks": 5,
    }


def mc(text, opts):
    return {
        "question_type": "multiple_choice",
        "question_data": {
            "question_type": "multiple_choice",
            "question_text": text,
            "choices": [{"text": t, "correct": c_} for t, c_ in opts],
        },
        "total_marks": 5,
    }


def tf(text, ans):
    return {
        "question_type": "true_false",
        "question_data": {
            "question_type": "true_false",
            "question_text": text,
            "true_false_answer": ans,
        },
        "total_marks": 5,
    }


def ui(text, ans):
    return {
        "question_type": "user_input",
        "question_data": {
            "question_type": "user_input",
            "question_text": text,
            "correct_answer": ans,
        },
        "total_marks": 5,
    }


def enroll(student_h, title, pin):
    r = c.post(
        "/student/enrolled_courses",
        headers=student_h,
        json={"course_title": title, "course_pin": pin},
    )
    if r.status_code not in (200, 400):
        print(f"  ! enroll {title}: {r.status_code} {r.text[:120]}")


def main():
    admin_h = login(*ADMIN)
    print("Users:")
    teachers = {
        "alice@example.com": ensure_user(admin_h, "alice@example.com", TEACHER_PW, "teacher"),
        "bob@example.com": ensure_user(admin_h, "bob@example.com", TEACHER_PW, "teacher"),
    }
    students = [
        ensure_user(admin_h, "sam@example.com", STUDENT_PW, "student"),
        ensure_user(admin_h, "nina@example.com", STUDENT_PW, "student"),
        ensure_user(admin_h, "omar@example.com", STUDENT_PW, "student"),
        ensure_user(admin_h, "lily@example.com", STUDENT_PW, "student"),
    ]

    alice = login("alice@example.com", TEACHER_PW)
    bob = login("bob@example.com", TEACHER_PW)

    print("Courses:")
    math = ensure_course(alice, "Mathematics 101", "Algebra, arithmetic, and a midterm.")
    physics = ensure_course(bob, "Physics 101", "Motion, forces, and units.")

    # Mathematics 101 content
    quiz1 = add_quiz(alice, "Mathematics 101", math, "Algebra Basics", 20, 3)
    for q in [
        sc("What is 5 + 7?", [("10", False), ("11", False), ("12", True), ("13", False)]),
        mc("Which of these are even numbers?", [("2", True), ("3", False), ("4", True), ("5", False)]),
        tf("Is 9 a prime number?", False),
        ui("What is the square root of 64?", "8"),
    ]:
        add_question(alice, "Mathematics 101", "quiz", quiz1["id"], q)

    quiz2 = add_quiz(alice, "Mathematics 101", math, "Quick Arithmetic", 10, 1)
    for q in [
        sc("What is 6 x 7?", [("42", True), ("36", False), ("48", False), ("49", False)]),
        ui("What is 100 divided by 4?", "25"),
    ]:
        add_question(alice, "Mathematics 101", "quiz", quiz2["id"], q)

    midterm = add_test(alice, "Mathematics 101", "Midterm Exam", 20, 60)
    for q in [
        sc("Solve: 3 x 4 = ?", [("10", False), ("12", True), ("14", False), ("16", False)]),
        ui("2 to the power 3 = ?", "8"),
    ]:
        add_question(alice, "Mathematics 101", "test", midterm["id"], q)

    # Physics 101 content
    pquiz = add_quiz(bob, "Physics 101", physics, "Motion Basics", 10, 2)
    for q in [
        sc("What is the SI unit of force?", [("Newton", True), ("Joule", False), ("Watt", False), ("Pascal", False)]),
        tf("Acceleration is the change in velocity over time.", True),
    ]:
        add_question(bob, "Physics 101", "quiz", pquiz["id"], q)

    print("Enrollments:")
    sam = login("sam@example.com", STUDENT_PW)
    nina = login("nina@example.com", STUDENT_PW)
    omar = login("omar@example.com", STUDENT_PW)
    lily = login("lily@example.com", STUDENT_PW)
    enroll(sam, "Mathematics 101", math["course_pin"])
    enroll(nina, "Mathematics 101", math["course_pin"])
    enroll(lily, "Mathematics 101", math["course_pin"])
    enroll(omar, "Physics 101", physics["course_pin"])
    enroll(lily, "Physics 101", physics["course_pin"])
    print("  enrolled sam, nina, lily -> Mathematics 101; omar, lily -> Physics 101")

    # Sam answers a couple of questions so teacher progress has data
    qs = c.get(
        f"/student/enrolled_courses/quiz/Mathematics 101/{quiz1['id']}", headers=sam
    ).json()
    qset = qs["question_set_id"]
    answers = {"single_choice": "12", "multiple_choice": ["2", "4"], "true_false": False, "user_input": "8"}
    submitted = 0
    for i, item in enumerate(qs["question_submissions"]):
        q = item["question"]
        qt = q["question_type"]
        # make one of them wrong on purpose
        val = answers[qt] if i != 1 else ["2"]
        r = c.post(
            f"/student/questions/submit/{q['id']}",
            headers=sam,
            params={"course_title": "Mathematics 101", "question_set_id": qset},
            json={"question_type": qt, "user_response": {"question_type": qt, "user_response": val}},
        )
        if r.status_code == 200:
            submitted += 1
    print(f"  sam submitted {submitted} answers to 'Algebra Basics'")

    return math, physics


if __name__ == "__main__":
    try:
        math, physics = main()
    except httpx.HTTPStatusError as e:
        print("HTTP error:", e.response.status_code, e.response.text[:200])
        sys.exit(1)
    # emit PINs for the credentials file
    print("PINS", math["course_pin"], physics["course_pin"])

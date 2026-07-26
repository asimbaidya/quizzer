from fastapi.testclient import TestClient

from app.core.config import settings
from tests.helpers import API, create_user, rand


def test_login_superuser(client: TestClient, superuser_token_headers):
    r = client.get(f"{API}/users/me", headers=superuser_token_headers)
    assert r.status_code == 200
    body = r.json()
    assert body["role"] == "admin"
    assert body["is_superuser"] is True


def test_login_wrong_password(client: TestClient):
    r = client.post(
        f"{API}/login/access-token",
        data={"username": settings.FIRST_SUPERUSER, "password": "nope"},
    )
    assert r.status_code == 400


def test_public_signup_cannot_self_elevate(client: TestClient):
    email = f"{rand('self_')}@ex.com"
    r = client.post(
        f"{API}/users/signup",
        json={"email": email, "password": "password123", "role": "admin"},
    )
    assert r.status_code == 200
    assert r.json()["role"] == "student"  # role in payload is ignored


def test_admin_creates_teacher(client: TestClient, superuser_token_headers):
    _, _, _ = create_user(client, superuser_token_headers, "teacher")


def test_student_cannot_access_admin_route(client: TestClient, superuser_token_headers):
    _, _, student_headers = create_user(client, superuser_token_headers, "student")
    r = client.post(
        f"{API}/admin/users",
        headers=student_headers,
        json={
            "email": f"{rand()}@ex.com",
            "password": "password123",
            "role": "student",
        },
    )
    assert r.status_code == 403


def test_non_admin_cannot_create_user(client: TestClient, superuser_token_headers):
    _, _, teacher_headers = create_user(client, superuser_token_headers, "teacher")
    r = client.post(
        f"{API}/admin/users",
        headers=teacher_headers,
        json={
            "email": f"{rand()}@ex.com",
            "password": "password123",
            "role": "teacher",
        },
    )
    assert r.status_code == 403

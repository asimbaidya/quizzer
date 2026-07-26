import uuid

from fastapi.testclient import TestClient

from app.core.config import settings

API = settings.API_V1_STR


def rand(prefix: str = "") -> str:
    return f"{prefix}{uuid.uuid4().hex[:10]}"


def auth_headers(client: TestClient, email: str, password: str) -> dict[str, str]:
    r = client.post(
        f"{API}/login/access-token", data={"username": email, "password": password}
    )
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def create_user(
    client: TestClient, admin_headers: dict[str, str], role: str
) -> tuple[str, str, dict[str, str]]:
    """Admin-create a user with a role; return (email, password, its headers)."""
    email = f"{rand(role + '_')}@ex.com"
    password = "password123"
    r = client.post(
        f"{API}/admin/users",
        headers=admin_headers,
        json={"email": email, "password": password, "role": role},
    )
    assert r.status_code == 200, r.text
    return email, password, auth_headers(client, email, password)

"""Pytest fixtures.

Tests run against an isolated ``<db>_test`` database so they never touch dev
data. The schema is created from the SQLModel metadata (not migrations) for
speed, and the app's ``get_db`` dependency is overridden to use the test engine.
"""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlmodel import Session, SQLModel

from app.api.deps import get_db
from app.core.config import settings
from app.core.db import init_db
from app.main import app

# Point at a dedicated test database next to the configured one.
_test_db_uri = str(settings.SQLALCHEMY_DATABASE_URI).replace(
    f"/{settings.POSTGRES_DB}", f"/{settings.POSTGRES_DB}_test"
)
test_engine = create_engine(_test_db_uri)


@pytest.fixture(scope="session", autouse=True)
def _setup_database() -> Generator[None]:
    SQLModel.metadata.drop_all(test_engine)
    SQLModel.metadata.create_all(test_engine)
    with Session(test_engine) as session:
        init_db(session)  # seed the first admin
    yield
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture
def db() -> Generator[Session]:
    with Session(test_engine) as session:
        yield session


@pytest.fixture
def client() -> Generator[TestClient]:
    def _override_get_db() -> Generator[Session]:
        with Session(test_engine) as session:
            yield session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def superuser_token_headers(client: TestClient) -> dict[str, str]:
    r = client.post(
        f"{settings.API_V1_STR}/login/access-token",
        data={
            "username": settings.FIRST_SUPERUSER,
            "password": settings.FIRST_SUPERUSER_PASSWORD,
        },
    )
    return {"Authorization": f"Bearer {r.json()['access_token']}"}

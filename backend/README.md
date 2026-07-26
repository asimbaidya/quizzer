# Quizzer — Backend

FastAPI + SQLModel + PostgreSQL. See the [root README](../README.md) for the full
overview, architecture, and setup.

```bash
uv sync
uv run alembic upgrade head
uv run python app/initial_data.py     # seed the first admin
uv run fastapi dev app/main.py        # http://localhost:8000  (docs at /docs)

uv run pytest                          # tests (needs the <db>_test database)
uv run ruff check app tests            # lint
uv run alembic revision --autogenerate -m "msg"   # after model changes
```

Layout: `app/api/routes` (endpoints), `app/core` (config/db/security),
`app/crud` (per-domain), `app/models` (SQLModel + JSONB payloads),
`app/marking.py` (auto-grading), `app/alembic` (migrations), `tests/`.

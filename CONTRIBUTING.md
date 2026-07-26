# Contributing

Thanks for your interest in Quizzer! This is a short guide to a productive setup.

## Setup

See the [Quick start](README.md#quick-start) in the README. In short: Postgres in
Docker (`docker compose up -d`), backend via `uv`, frontend via `bun`.

## Development workflow

- **Branch** off `main` for changes; keep commits small and focused.
- **Backend** lives in `backend/` (FastAPI + SQLModel). After changing models,
  generate a migration:
  ```bash
  cd backend
  uv run alembic revision --autogenerate -m "describe change"
  uv run alembic upgrade head
  ```
- **Frontend** lives in `frontend/` (React + shadcn/ui). After changing the
  backend API, regenerate the typed client (see the README note).

## Before you push

Run the same checks CI runs:

```bash
# backend
cd backend && uv run ruff check app tests && uv run ruff format --check app tests && uv run pytest -q
# frontend
cd frontend && bunx biome check && bunx tsc --noEmit -p tsconfig.build.json && bun run build
```

Optionally install pre-commit hooks so these run automatically:

```bash
uv run --project backend pre-commit install
```

## Commit messages

Conventional-style prefixes are used (`feat:`, `fix:`, `chore:`, `test:`, `ci:`,
`docs:`). Keep the subject imperative and under ~72 chars.

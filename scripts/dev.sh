#!/usr/bin/env bash
#
# Local dev orchestrator for Quizzer: Postgres (Docker) + backend + frontend.
#
#   ./scripts/dev.sh up      # start db, backend (:8001), frontend (:5173)
#   ./scripts/dev.sh seed    # load the demo dataset (idempotent-ish; run once)
#   ./scripts/dev.sh down     # stop backend + frontend, stop the db container
#   ./scripts/dev.sh status   # what's running
#   ./scripts/dev.sh logs [backend|frontend]   # tail a log
#
# Requires: docker, uv, bun. Reads config from the root .env.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN="$ROOT/.dev"          # pids + logs live here (git-ignored)
mkdir -p "$RUN"

BACKEND_PORT=8001
FRONTEND_PORT=5173
HEALTH="http://localhost:$BACKEND_PORT/api/v1/utils/health-check/"

log()  { printf '\033[1;36m›\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

need() { command -v "$1" >/dev/null 2>&1 || die "'$1' not found on PATH"; }

wait_for() { # wait_for <name> <url> <max-seconds>
  local i=0
  until curl -sf "$2" >/dev/null 2>&1; do
    i=$((i+1)); [ "$i" -ge "$3" ] && return 1
    sleep 1
  done
}

start_db() {
  need docker
  docker info >/dev/null 2>&1 || die "Docker isn't running — start Docker Desktop first."
  log "Starting Postgres (docker compose)…"
  (cd "$ROOT" && docker compose up -d)
  log "Waiting for Postgres to be ready…"
  local i=0
  until (cd "$ROOT" && docker compose exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" >/dev/null 2>&1); do
    i=$((i+1)); [ "$i" -ge 30 ] && die "Postgres did not become ready in time."
    sleep 1
  done
}

start_backend() {
  need uv
  if curl -sf "$HEALTH" >/dev/null 2>&1; then
    log "Backend already up on :$BACKEND_PORT"; return
  fi
  log "Applying migrations + seeding first superuser…"
  (cd "$ROOT/backend" && uv run bash scripts/prestart.sh) >"$RUN/prestart.log" 2>&1 \
    || die "prestart failed — see $RUN/prestart.log"
  log "Starting backend (fastapi dev :$BACKEND_PORT)…"
  (cd "$ROOT/backend" && nohup uv run fastapi dev app/main.py --port "$BACKEND_PORT" \
    >"$RUN/backend.log" 2>&1 & echo $! >"$RUN/backend.pid")
  wait_for backend "$HEALTH" 40 \
    || die "Backend didn't come healthy — see $RUN/backend.log"
  log "Backend healthy."
}

start_frontend() {
  need bun
  if lsof -iTCP:"$FRONTEND_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    log "Frontend already up on :$FRONTEND_PORT"; return
  fi
  log "Starting frontend (bun run dev :$FRONTEND_PORT)…"
  (cd "$ROOT/frontend" && nohup bun run dev >"$RUN/frontend.log" 2>&1 & echo $! >"$RUN/frontend.pid")
  wait_for frontend "http://localhost:$FRONTEND_PORT" 40 \
    || warn "Frontend not answering yet — check $RUN/frontend.log"
}

seed() {
  need uv
  curl -sf "$HEALTH" >/dev/null 2>&1 || die "Backend not running — './scripts/dev.sh up' first."
  log "Seeding demo data…"
  (cd "$ROOT/backend" && uv run python "$ROOT/scripts/seed_demo.py") \
    || warn "Seed reported errors (already seeded?). Check output above."
  cat <<EOF

Demo logins (password shown):
  student   sam@example.com    Student123!
  teacher   alice@example.com  Teacher123!
  admin     admin@example.com  ChangeMe_Admin123
EOF
}

stop_proc() { # stop_proc <name>
  local pidfile="$RUN/$1.pid"
  if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
    log "Stopping $1 (pid $(cat "$pidfile"))…"
    # kill the process group so child (uvicorn/vite) workers die too
    kill -- "-$(ps -o pgid= -p "$(cat "$pidfile")" | tr -d ' ')" 2>/dev/null \
      || kill "$(cat "$pidfile")" 2>/dev/null || true
  else
    warn "$1 not tracked as running."
  fi
  rm -f "$pidfile"
}

case "${1:-}" in
  up)
    # export .env so POSTGRES_USER etc. are available to this script
    set -a; [ -f "$ROOT/.env" ] && . "$ROOT/.env"; set +a
    start_db
    start_backend
    start_frontend
    cat <<EOF

$(printf '\033[1;32m✓ Quizzer dev stack is up\033[0m')
  Frontend  http://localhost:$FRONTEND_PORT
  Backend   http://localhost:$BACKEND_PORT/docs
  Logs      $RUN/{backend,frontend}.log

Next: './scripts/dev.sh seed' (first run) then log in as sam@example.com / Student123!
Stop:  './scripts/dev.sh down'
EOF
    ;;
  seed)   set -a; [ -f "$ROOT/.env" ] && . "$ROOT/.env"; set +a; seed ;;
  down)
    stop_proc frontend
    stop_proc backend
    log "Stopping Postgres container…"
    (cd "$ROOT" && docker compose stop) 2>/dev/null || true
    log "Down. (DB data is preserved; 'docker compose down -v' to wipe it.)"
    ;;
  status)
    curl -sf "$HEALTH" >/dev/null 2>&1 && echo "backend  : UP ($HEALTH)" || echo "backend  : down"
    lsof -iTCP:"$FRONTEND_PORT" -sTCP:LISTEN >/dev/null 2>&1 && echo "frontend : UP (:$FRONTEND_PORT)" || echo "frontend : down"
    (cd "$ROOT" && docker compose ps db 2>/dev/null) || true
    ;;
  logs)
    tail -f "$RUN/${2:-backend}.log"
    ;;
  *)
    grep -E '^#( |$)' "$0" | sed -E 's/^# ?//'
    exit 1
    ;;
esac

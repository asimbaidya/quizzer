#!/bin/bash
# Runs once on first Postgres init. Creates the dedicated test database used by
# the backend pytest suite (conftest.py points at "<POSTGRES_DB>_test").
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	SELECT 'CREATE DATABASE ${POSTGRES_DB}_test'
	WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${POSTGRES_DB}_test')\gexec
EOSQL

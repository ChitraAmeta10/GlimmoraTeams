#!/usr/bin/env sh
# Run API from repo root when Render "Root Directory" is empty.
cd backend || exit 1
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"

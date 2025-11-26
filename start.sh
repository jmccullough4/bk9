#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PORT="${PORT:-4000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

if [[ ! -f "$ROOT_DIR/.env" ]]; then
  cat <<'MSG'
[BlueK9] Missing .env file at project root. Create one with MAPBOX_TOKEN, BLUEK9_USERNAME, BLUEK9_PASSWORD, DB_URL, SIMCOM7600_SERIAL_PORT, SIMCOM7600_BAUDRATE, VITE_MAPBOX_TOKEN, and VITE_API_BASE_URL before starting.
MSG
  exit 1
fi

echo "[BlueK9] Installing backend dependencies..."
npm --prefix "$ROOT_DIR/backend" install

echo "[BlueK9] Installing frontend dependencies..."
npm --prefix "$ROOT_DIR/frontend" install

echo "[BlueK9] Starting backend on port ${BACKEND_PORT}..."
PORT="$BACKEND_PORT" npm --prefix "$ROOT_DIR/backend" run dev &
BACKEND_PID=$!

echo "[BlueK9] Starting frontend on port ${FRONTEND_PORT}..."
VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:${BACKEND_PORT}}" npm --prefix "$ROOT_DIR/frontend" run dev -- --host 0.0.0.0 --port "$FRONTEND_PORT" &
FRONTEND_PID=$!

cleanup() {
  echo "[BlueK9] Shutting down..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

wait -n

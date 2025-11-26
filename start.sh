#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PORT="${PORT:-4000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

if [[ ! -f "$ROOT_DIR/.env" ]]; then
  echo "[BlueK9] No .env detected. Creating one with sensible defaults..."
  cat >"$ROOT_DIR/.env" <<EOF
MAPBOX_TOKEN=pk.eyJ1Ijoiam1jY3VsbG91Z2g0IiwiYSI6ImNtMGJvOXh3cDBjNncya3B4cDg0MXFuYnUifQ.uDJKnqE9WgkvGXYGLge-NQ
BLUEK9_USERNAME=bluek9
BLUEK9_PASSWORD=warhammer
DB_URL=postgres://bluek9:bluek9@localhost:5432/bluek9
SIMCOM7600_SERIAL_PORT=/dev/ttyUSB2
SIMCOM7600_BAUDRATE=115200
VITE_MAPBOX_TOKEN=pk.eyJ1Ijoiam1jY3VsbG91Z2g0IiwiYSI6ImNtMGJvOXh3cDBjNncya3B4cDg0MXFuYnUifQ.uDJKnqE9WgkvGXYGLge-NQ
VITE_API_BASE_URL=http://localhost:${BACKEND_PORT}
EOF
fi

echo "[BlueK9] Loading environment from .env..."
set -a
source "$ROOT_DIR/.env"
set +a

# Re-resolve ports after loading .env in case they were defined there
BACKEND_PORT="${PORT:-$BACKEND_PORT}"
FRONTEND_PORT="${FRONTEND_PORT:-$FRONTEND_PORT}"

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

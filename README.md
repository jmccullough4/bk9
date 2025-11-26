# BlueK9

## Quick start
1. Run `./start.sh` – if no `.env` exists, the script will create one with the defaults below:
   - MAPBOX_TOKEN / VITE_MAPBOX_TOKEN: pk.eyJ1Ijoiam1jY3VsbG91Z2g0IiwiYSI6ImNtMGJvOXh3cDBjNncya3B4cDg0MXFuYnUifQ.uDJKnqE9WgkvGXYGLge-NQ
   - BLUEK9_USERNAME / BLUEK9_PASSWORD: bluek9 / warhammer
   - DB_URL: postgres://bluek9:bluek9@localhost:5432/bluek9
   - SIMCOM7600_SERIAL_PORT / SIMCOM7600_BAUDRATE: /dev/ttyUSB2 / 115200
   - VITE_API_BASE_URL: http://localhost:4000
2. The script installs dependencies and launches backend (default: :4000) and frontend (default: :5173) dev servers.
3. Open the frontend dev server in your browser and log in with the configured credentials.

The startup script auto-loads `.env`, auto-wires `VITE_API_BASE_URL` to the backend port when creating it, and keeps both processes running until you exit.

# BlueK9

## Quick start
1. Create a `.env` file in the repo root with MAPBOX_TOKEN, BLUEK9_USERNAME, BLUEK9_PASSWORD, DB_URL, SIMCOM7600_SERIAL_PORT, SIMCOM7600_BAUDRATE, VITE_MAPBOX_TOKEN, and VITE_API_BASE_URL.
2. Run `./start.sh` to install dependencies and launch both backend (default: :4000) and frontend (default: :5173) dev servers.
3. Open the frontend dev server in your browser and log in with the configured credentials.

The startup script auto-wires `VITE_API_BASE_URL` to the backend port if it is not already set and keeps both processes running until you exit.

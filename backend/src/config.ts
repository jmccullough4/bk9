import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mapboxToken: process.env.MAPBOX_TOKEN || '',
  username: process.env.BLUEK9_USERNAME || 'bluek9',
  password: process.env.BLUEK9_PASSWORD || 'warhammer',
  dbUrl: process.env.DB_URL || '',
  simcomPort: process.env.SIMCOM7600_SERIAL_PORT || '/dev/ttyUSB2',
  simcomBaud: Number(process.env.SIMCOM7600_BAUDRATE || '115200'),
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:4000',
};

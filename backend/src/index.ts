import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { requireAuth } from './auth/authMiddleware';
import { config } from './config';
import { BluetoothScanner } from './bluetooth/bluetoothScanner';
import { WifiScanner } from './wifi/wifiScanner';
import { GpsService } from './gps/gpsService';
import { LogService } from './logs/logService';
import { SmsService } from './sms/smsService';
import { Device } from './models/device';
import { TargetsStore, createTargetsRouter } from './routes/targets';
import { createDevicesRouter } from './routes/devices';
import { createLogsRouter } from './routes/logs';
import { createConfigRouter } from './routes/config';
import { setupRealtime } from './ws/realtime';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const devices: Device[] = [];
const targetsStore = new TargetsStore();
const logService = new LogService();
const smsService = new SmsService();

const bluetoothScanner = new BluetoothScanner(targetsStore);
const wifiScanner = new WifiScanner();
const gpsService = new GpsService();

setupRealtime(
  io,
  { bluetooth: bluetoothScanner, wifi: wifiScanner, gps: gpsService },
  { log: logService, sms: smsService },
  devices,
);

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === config.username && password === config.password) {
    return res.json({ token: Buffer.from(`${username}:${password}`).toString('base64') });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

app.use('/api/devices', requireAuth, createDevicesRouter(devices));
app.use('/api/targets', requireAuth, createTargetsRouter(targetsStore));
app.use('/api/logs', requireAuth, createLogsRouter(logService));
app.use('/api/config', createConfigRouter());

io.on('connection', (socket) => {
  logService.add({ level: 'info', message: 'Client connected' });
  socket.emit('devices:update', devices);
  socket.emit('log:entry', logService.list());
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`BlueK9 backend running on http://localhost:${PORT}`);
  bluetoothScanner.start();
  wifiScanner.start();
  gpsService.start();
});

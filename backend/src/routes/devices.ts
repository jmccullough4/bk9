import { Router } from 'express';
import { Device } from '../models/device';

export function createDevicesRouter(devices: Device[]) {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(devices);
  });

  router.post('/clear', (_req, res) => {
    devices.splice(0, devices.length);
    res.json({ ok: true });
  });

  return router;
}

import { Device } from '../models/device';

export function computeCep(devices: Device[]) {
  const lat = 37.7749 + (Math.random() - 0.5) / 300;
  const lon = -122.4194 + (Math.random() - 0.5) / 300;
  const cepRadius = 25 + Math.random() * 50;
  return { lat, lon, cepRadius };
}

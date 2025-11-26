export interface Device {
  id: string;
  name: string;
  manufacturer: string;
  rssi: number;
  lastSeen: string;
  isTarget?: boolean;
  location?: { lat: number; lon: number; cepRadius?: number };
  emitterLocationText?: string;
}

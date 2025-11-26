import { create } from 'zustand';

export interface Device {
  id: string;
  name: string;
  manufacturer: string;
  rssi: number;
  lastSeen: string;
  location?: { lat: number; lon: number; cepRadius?: number };
  emitterLocationText?: string;
  isTarget?: boolean;
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

interface GpsPosition {
  lat: number;
  lon: number;
  timestamp: string;
}

interface BlueK9State {
  devices: Device[];
  selectedDeviceId?: string;
  logs: LogEntry[];
  isLoggedIn: boolean;
  followGps: boolean;
  mapStyle: string;
  smsRecipients: string[];
  gps?: GpsPosition;
  setLoggedIn: (value: boolean) => void;
  setDevices: (devices: Device[] | ((prev: Device[]) => Device[])) => void;
  addLog: (entries: LogEntry[]) => void;
  selectDevice: (id?: string) => void;
  toggleFollowGps: () => void;
  setMapStyle: (style: string) => void;
  setSmsRecipients: (nums: string[]) => void;
  setGps: (pos: GpsPosition) => void;
}

export const useBlueK9Store = create<BlueK9State>((set) => ({
  devices: [],
  logs: [],
  isLoggedIn: false,
  followGps: false,
  mapStyle: 'mapbox://styles/mapbox/dark-v11',
  smsRecipients: [],
  setLoggedIn: (value) => set({ isLoggedIn: value }),
  setDevices: (devices) => set((state) => ({ devices: typeof devices === 'function' ? devices(state.devices) : devices })),
  addLog: (entries) => set({ logs: entries }),
  selectDevice: (id) => set({ selectedDeviceId: id }),
  toggleFollowGps: () => set((s) => ({ followGps: !s.followGps })),
  setMapStyle: (style) => set({ mapStyle: style }),
  setSmsRecipients: (nums) => set({ smsRecipients: nums }),
  setGps: (gps) => set({ gps }),
}));

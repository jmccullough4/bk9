import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useBlueK9Store, Device } from '../state/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export function useWebSocket() {
  const setDevices = useBlueK9Store((s) => s.setDevices);
  const addLog = useBlueK9Store((s) => s.addLog);
  const setGps = useBlueK9Store((s) => s.setGps);

  useEffect(() => {
    const socket = io(API_BASE_URL, { transports: ['websocket'] });
    socket.on('devices:update', (devices: Device[]) => setDevices(devices));
    socket.on('map:update', (device: Device) => {
      setDevices((prev) => {
        const others = prev.filter((d) => d.id !== device.id);
        return [...others, device];
      });
    });
    socket.on('log:entry', (logs) => addLog(logs));
    socket.on('status:update', (status) => {
      if (status.gps) setGps(status.gps);
    });
    socket.on('alert:targetDetected', (device: Device) => {
      const audio = new Audio('/alert.wav');
      audio.play();
      const banner = document.createElement('div');
      banner.className =
        'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-pulse';
      banner.innerText = `TARGET DETECTED: ${device.id}`;
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 4000);
    });
    return () => socket.disconnect();
  }, [addLog, setDevices, setGps]);
}

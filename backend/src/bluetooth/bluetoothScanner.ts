import { EventEmitter } from 'events';
import { Device } from '../models/device';
import { TargetsStore } from '../routes/targets';

export class BluetoothScanner extends EventEmitter {
  private timer?: NodeJS.Timer;

  constructor(private targetsStore: TargetsStore) {
    super();
  }

  start() {
    this.stop();
    this.timer = setInterval(() => this.emitRandom(), 3500);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  private emitRandom() {
    const sampleDevices: Device[] = [
      {
        id: 'AA:BB:CC:DD:EE:01',
        name: 'Sena-Tracker',
        manufacturer: 'Sena',
        rssi: -52,
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'DE:AD:BE:EF:CA:FE',
        name: 'Target Beacon',
        manufacturer: 'Unknown',
        rssi: -61,
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'FA:CE:FE:ED:BE:EF',
        name: 'BLE Sensor',
        manufacturer: 'Nordic',
        rssi: -72,
        lastSeen: new Date().toISOString(),
      },
    ];

    const device = { ...sampleDevices[Math.floor(Math.random() * sampleDevices.length)] };
    device.lastSeen = new Date().toISOString();
    device.rssi = -40 - Math.floor(Math.random() * 50);
    device.location = this.fakeGeo(device.rssi);
    device.emitterLocationText = `${device.location.lat.toFixed(5)}, ${device.location.lon.toFixed(5)}`;
    device.isTarget = this.targetsStore.isTarget(device.id);
    this.emit('device', device);
  }

  private fakeGeo(rssi: number) {
    const baseLat = 37.7749;
    const baseLon = -122.4194;
    const noise = (Math.random() - 0.5) / 500;
    const cepRadius = Math.max(20, 5 - rssi) + Math.random() * 30;
    return { lat: baseLat + noise, lon: baseLon + noise, cepRadius };
  }
}

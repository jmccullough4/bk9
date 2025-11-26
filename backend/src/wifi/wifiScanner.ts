import { EventEmitter } from 'events';

export interface WifiNetwork {
  bssid: string;
  ssid: string;
  rssi: number;
  channel: number;
}

export class WifiScanner extends EventEmitter {
  private timer?: NodeJS.Timer;

  start() {
    this.stop();
    this.timer = setInterval(() => {
      const networks: WifiNetwork[] = [
        { bssid: '00:11:22:33:44:55', ssid: 'OpsNet', rssi: -55, channel: 11 },
        { bssid: '66:77:88:99:AA:BB', ssid: 'MeshNode', rssi: -68, channel: 6 },
      ];
      this.emit('wifi', networks[Math.floor(Math.random() * networks.length)]);
    }, 5500);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }
}

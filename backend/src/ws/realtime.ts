import { Server } from 'socket.io';
import { BluetoothScanner } from '../bluetooth/bluetoothScanner';
import { WifiScanner } from '../wifi/wifiScanner';
import { GpsService } from '../gps/gpsService';
import { LogService } from '../logs/logService';
import { SmsService } from '../sms/smsService';
import { Device } from '../models/device';

export function setupRealtime(
  io: Server,
  scanners: {
    bluetooth: BluetoothScanner;
    wifi: WifiScanner;
    gps: GpsService;
  },
  services: { log: LogService; sms: SmsService },
  devices: Device[],
) {
  scanners.bluetooth.on('device', (device: Device) => {
    devices.push(device);
    services.log.add({ level: 'info', message: `BT ${device.id} @ RSSI ${device.rssi}` });
    io.emit('devices:update', devices);
    io.emit('map:update', device);
    if (device.isTarget) {
      io.emit('alert:targetDetected', device);
      services.sms.sendAlert(device.id);
    }
  });

  scanners.wifi.on('wifi', (network) => {
    services.log.add({ level: 'info', message: `WiFi ${network.ssid} (${network.bssid})` });
    io.emit('log:entry', services.log.list());
  });

  scanners.gps.on('position', (pos) => {
    io.emit('status:update', { gps: pos });
  });

  services.sms.on('sms', (alert) => {
    services.log.add({ level: 'info', message: `SMS sent to ${alert.to} for ${alert.deviceId}` });
    io.emit('log:entry', services.log.list());
  });

  services.log.on('log', () => {
    io.emit('log:entry', services.log.list());
  });
}

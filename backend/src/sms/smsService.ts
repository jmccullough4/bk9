import { EventEmitter } from 'events';
import { config } from '../config';

export interface SmsAlert {
  to: string;
  deviceId: string;
  timestamp: string;
}

export class SmsService extends EventEmitter {
  private recipients: string[] = [];

  addRecipient(num: string) {
    if (this.recipients.length < 10 && /^\+?1?\d{10}$/.test(num)) {
      this.recipients.push(num);
    }
  }

  sendAlert(deviceId: string) {
    const now = new Date().toISOString();
    this.recipients.forEach((to) => {
      const alert: SmsAlert = { to, deviceId, timestamp: now };
      this.emit('sms', alert);
      console.log(`SIMCOM7600 (${config.simcomPort}) -> Sending SMS to ${to} about ${deviceId}`);
    });
  }

  list() {
    return this.recipients;
  }
}

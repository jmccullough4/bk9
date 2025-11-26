import { EventEmitter } from 'events';

export class GpsService extends EventEmitter {
  private timer?: NodeJS.Timer;
  private lat = 37.7749;
  private lon = -122.4194;

  start() {
    this.stop();
    this.timer = setInterval(() => this.emitPosition(), 5000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  private emitPosition() {
    this.lat += (Math.random() - 0.5) / 1000;
    this.lon += (Math.random() - 0.5) / 1000;
    this.emit('position', {
      lat: this.lat,
      lon: this.lon,
      timestamp: new Date().toISOString(),
    });
  }
}

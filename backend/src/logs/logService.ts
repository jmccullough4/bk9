import { EventEmitter } from 'events';

export interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export class LogService extends EventEmitter {
  private entries: LogEntry[] = [];

  add(entry: Omit<LogEntry, 'timestamp'>) {
    const full: LogEntry = { ...entry, timestamp: new Date().toISOString() };
    this.entries.push(full);
    this.emit('log', full);
  }

  list() {
    return this.entries.slice(-200);
  }
}

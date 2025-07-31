interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG';
  message: string;
  service: string;
  data?: any;
}

class Logger {
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  private createLogEntry(level: 'INFO' | 'ERROR' | 'WARN' | 'DEBUG', message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      data
    };
  }

  info(message: string, data?: any): void {
    const logEntry = this.createLogEntry('INFO', message, data);
    console.log(JSON.stringify(logEntry));
  }

  error(message: string, data?: any): void {
    const logEntry = this.createLogEntry('ERROR', message, data);
    console.error(JSON.stringify(logEntry));
  }

  warn(message: string, data?: any): void {
    const logEntry = this.createLogEntry('WARN', message, data);
    console.warn(JSON.stringify(logEntry));
  }

  debug(message: string, data?: any): void {
    const logEntry = this.createLogEntry('DEBUG', message, data);
    console.debug(JSON.stringify(logEntry));
  }
}

export const logger = new Logger('user-management-service'); 
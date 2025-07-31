interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = LOG_LEVELS[process.env['LOG_LEVEL'] as keyof LogLevel] || LOG_LEVELS.INFO;

class Logger {
  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      service: 'auth-service',
      ...(data && { data })
    };
    
    return JSON.stringify(logEntry);
  }

  error(message: string, data?: any): void {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage('ERROR', message, data));
    }
  }

  warn(message: string, data?: any): void {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  info(message: string, data?: any): void {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.info(this.formatMessage('INFO', message, data));
    }
  }

  debug(message: string, data?: any): void {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message, data));
    }
  }

  // Métodos específicos para autenticación
  authAttempt(email: string, success: boolean): void {
    this.info(`🔐 Intento de autenticación: ${email}`, { success });
  }

  userRegistered(email: string, role: string): void {
    this.info(`📝 Usuario registrado: ${email} (${role})`);
  }

  tokenGenerated(userId: string): void {
    this.debug(`🎫 Token generado para usuario: ${userId}`);
  }

  tokenVerified(userId: string): void {
    this.debug(`✅ Token verificado para usuario: ${userId}`);
  }

  tokenExpired(userId: string): void {
    this.warn(`⏰ Token expirado para usuario: ${userId}`);
  }

  passwordChanged(userId: string): void {
    this.info(`🔑 Contraseña cambiada para usuario: ${userId}`);
  }

  profileUpdated(userId: string): void {
    this.info(`✏️ Perfil actualizado para usuario: ${userId}`);
  }
}

export const logger = new Logger(); 
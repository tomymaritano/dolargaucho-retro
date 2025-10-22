/**
 * Structured Logging Utility
 * Logging centralizado y configurable para toda la aplicación
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Configuración del logger
 */
const CONFIG = {
  // Nivel mínimo de log a mostrar
  minLevel: (process.env.NODE_ENV === 'production' ? 'warn' : 'debug') as LogLevel,

  // Habilitar/deshabilitar logs por ambiente
  enabled: {
    development: true,
    production: true,
    test: false,
  },

  // Prefijos de color para consola (solo en desarrollo)
  colors: {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[34m', // Blue
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m',
  },
} as const;

/**
 * Niveles numéricos para comparación
 */
const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Determina si el logger está habilitado en el ambiente actual
 */
function isEnabled(): boolean {
  const env = process.env.NODE_ENV || 'development';
  return CONFIG.enabled[env as keyof typeof CONFIG.enabled] ?? true;
}

/**
 * Determina si un nivel de log debe mostrarse
 */
function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[CONFIG.minLevel];
}

/**
 * Formatea el mensaje de log con contexto
 */
function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const isDev = process.env.NODE_ENV === 'development';

  // En desarrollo: colorido y legible
  if (isDev) {
    const color = CONFIG.colors[level];
    const reset = CONFIG.colors.reset;
    const contextStr = context ? `\n${JSON.stringify(context, null, 2)}` : '';

    return `${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}${contextStr}`;
  }

  // En producción: formato JSON para parseo
  return JSON.stringify({
    level,
    timestamp,
    message,
    ...context,
  });
}

/**
 * Función interna de logging
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!isEnabled() || !shouldLog(level)) {
    return;
  }

  const formatted = formatMessage(level, message, context);

  switch (level) {
    case 'debug':
    case 'info':
      console.log(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'error':
      console.error(formatted);
      break;
  }
}

/**
 * Logger público
 */
export const logger = {
  /**
   * Log de debugging (solo en desarrollo)
   */
  debug: (message: string, context?: LogContext) => {
    log('debug', message, context);
  },

  /**
   * Log informativo
   */
  info: (message: string, context?: LogContext) => {
    log('info', message, context);
  },

  /**
   * Log de advertencia
   */
  warn: (message: string, context?: LogContext) => {
    log('warn', message, context);
  },

  /**
   * Log de error
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    const errorContext = {
      ...context,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    };

    log('error', message, errorContext);
  },

  /**
   * Log de API request
   */
  api: {
    request: (url: string, method: string = 'GET') => {
      logger.debug('API Request', { url, method });
    },

    response: (url: string, status: number, duration?: number) => {
      logger.debug('API Response', { url, status, duration });
    },

    error: (url: string, error: Error | unknown) => {
      logger.error('API Error', error, { url });
    },
  },

  /**
   * Log de hook lifecycle
   */
  hook: {
    mount: (hookName: string, params?: LogContext) => {
      logger.debug(`Hook mounted: ${hookName}`, params);
    },

    unmount: (hookName: string) => {
      logger.debug(`Hook unmounted: ${hookName}`);
    },

    refetch: (hookName: string, reason?: string) => {
      logger.debug(`Hook refetch: ${hookName}`, { reason });
    },
  },
};

/**
 * Helper para medir tiempo de ejecución
 */
export function measureTime<T>(label: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  logger.debug(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });

  return result;
}

/**
 * Helper para medir tiempo de async functions
 */
export async function measureTimeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  logger.debug(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });

  return result;
}

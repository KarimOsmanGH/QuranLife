/**
 * Environment-aware logging utility for QuranLife
 * Prevents sensitive information from being logged in production
 */

const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log general information (development only)
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log('[QuranLife]', ...args);
    }
  },

  /**
   * Log errors (always logged, but with less detail in production)
   */
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error('[QuranLife Error]', message, error);
    } else {
      // In production, log minimal error info
      console.error('[QuranLife Error]', message);
    }
  },

  /**
   * Log warnings (development only)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn('[QuranLife Warning]', ...args);
    }
  },

  /**
   * Log debug information (development only)
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug('[QuranLife Debug]', ...args);
    }
  },
};

export default logger;

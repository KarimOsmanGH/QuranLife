/**
 * Enhanced logging utility for QuranLife
 * Provides environment-aware logging with error tracking and performance monitoring
 */

const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

// Error tracking storage
const errorHistory: Array<{ timestamp: number; message: string; error?: unknown; context?: string }> = [];
const MAX_ERROR_HISTORY = 50;

// Performance monitoring
const performanceMarks: Map<string, number> = new Map();

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
   * Log errors with enhanced tracking
   */
  error: (message: string, error?: unknown, context?: string) => {
    const errorEntry = {
      timestamp: Date.now(),
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: isDevelopment ? error.stack : undefined
      } : error,
      context
    };

    // Store error in history
    errorHistory.push(errorEntry);
    if (errorHistory.length > MAX_ERROR_HISTORY) {
      errorHistory.shift();
    }

    if (isDevelopment) {
      console.error('[QuranLife Error]', message, error, context ? `Context: ${context}` : '');
    } else {
      // In production, log minimal error info
      console.error('[QuranLife Error]', message, context ? `Context: ${context}` : '');
    }

    // In production, you could send errors to a monitoring service here
    if (!isDevelopment && isClient) {
      // Example: Send to error monitoring service
      // errorMonitoringService.track(errorEntry);
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

  /**
   * Performance monitoring
   */
  performance: {
    /**
     * Start a performance measurement
     */
    start: (name: string) => {
      if (isClient && performance.mark) {
        performance.mark(`${name}-start`);
        performanceMarks.set(name, performance.now());
      }
    },

    /**
     * End a performance measurement and log the result
     */
    end: (name: string) => {
      if (isClient && performance.mark) {
        performance.mark(`${name}-end`);
        const startTime = performanceMarks.get(name);
        if (startTime !== undefined) {
          const duration = performance.now() - startTime;
          performanceMarks.delete(name);
          
          if (isDevelopment) {
            console.log(`[QuranLife Performance] ${name}: ${duration.toFixed(2)}ms`);
          }
          
          return duration;
        }
      }
      return 0;
    },

    /**
     * Measure a function execution time
     */
    measure: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
      logger.performance.start(name);
      try {
        const result = await fn();
        logger.performance.end(name);
        return result;
      } catch (error) {
        logger.performance.end(name);
        throw error;
      }
    }
  },

  /**
   * Get error history for debugging
   */
  getErrorHistory: () => {
    if (isDevelopment) {
      return errorHistory;
    }
    return [];
  },

  /**
   * Clear error history
   */
  clearErrorHistory: () => {
    errorHistory.length = 0;
  }
};

export default logger;

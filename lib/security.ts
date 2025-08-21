/**
 * Security utilities for QuranLife app
 * Author: Karim Osman (https://kar.im)
 */

// Safe JSON parsing with error handling
export function safeJSONParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return fallback;
  }
}

// Safe localStorage operations with error handling
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    
    try {
      const item = localStorage.getItem(key);
      return safeJSONParse(item, fallback);
    } catch (error) {
      console.warn('Failed to get item from localStorage:', error);
      return fallback;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  }
};

// Input validation for goals and habits
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .substring(0, 500); // Limit length
}

// Validate habit structure
export function isValidHabit(habit: any): boolean {
  return (
    typeof habit === 'object' &&
    typeof habit.id === 'string' &&
    typeof habit.name === 'string' &&
    typeof habit.completed === 'boolean' &&
    habit.name.length > 0 &&
    habit.name.length <= 100
  );
}

// Validate goal structure
export function isValidGoal(goal: any): boolean {
  return (
    typeof goal === 'object' &&
    typeof goal.id === 'string' &&
    typeof goal.title === 'string' &&
    typeof goal.completed === 'boolean' &&
    typeof goal.category === 'string' &&
    ['low', 'medium', 'high'].includes(goal.priority) &&
    goal.title.length > 0 &&
    goal.title.length <= 200 &&
    (goal.description === undefined || (typeof goal.description === 'string' && goal.description.length <= 1000))
  );
}

// Rate limiting for API calls (simple implementation)
class RateLimiter {
  private calls: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    
    if (this.calls.length >= this.limit) {
      return false;
    }
    
    this.calls.push(now);
    return true;
  }
}

export const apiRateLimiter = new RateLimiter(20, 60000); // 20 calls per minute 
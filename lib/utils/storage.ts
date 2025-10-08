/**
 * Safe localStorage utilities
 * Handles SSR, errors, and provides type-safe storage operations
 */

/**
 * Check if localStorage is available
 */
export const isStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get item from localStorage with type safety
 */
export function getStorageItem<T>(key: string): T | null {
  if (!isStorageAvailable()) return null;

  try {
    const item = window.localStorage.getItem(key);
    if (!item) return null;

    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Set item in localStorage with type safety
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false;

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (!isStorageAvailable()) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): boolean {
  if (!isStorageAvailable()) return false;

  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Get multiple items from localStorage
 */
export function getStorageItems<T extends Record<string, unknown>>(keys: string[]): Partial<T> {
  const result: Partial<T> = {};

  keys.forEach((key) => {
    const value = getStorageItem(key);
    if (value !== null) {
      result[key as keyof T] = value as T[keyof T];
    }
  });

  return result;
}

/**
 * Set multiple items in localStorage
 */
export function setStorageItems<T extends Record<string, unknown>>(items: T): boolean {
  try {
    Object.entries(items).forEach(([key, value]) => {
      setStorageItem(key, value);
    });
    return true;
  } catch (error) {
    console.error('Error setting multiple storage items:', error);
    return false;
  }
}

// Storage keys constants
export const STORAGE_KEYS = {
  DEMO_USER: 'demo_user',
  DEMO_PREFERENCES: 'demo_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

/**
 * Cache Service
 * 
 * Manages API response caching with TTL-based expiration.
 * Uses memory-based cache with optional localStorage fallback for persistence.
 * 
 * Cache Strategy:
 * - Default TTL: 5 minutes for trending/top-rated
 * - Extended TTL: 1 hour for movie details and credits
 * 
 * Validates: Requirements 12.5
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// TTL constants in milliseconds
export const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
export const EXTENDED_TTL = 60 * 60 * 1000; // 1 hour

const STORAGE_KEY = 'movie_app_cache';

class CacheService {
  private memoryCache: Map<string, CacheEntry<unknown>>;
  private useLocalStorage: boolean;

  constructor(useLocalStorage: boolean = true) {
    this.memoryCache = new Map();
    this.useLocalStorage = useLocalStorage && this.isLocalStorageAvailable();
    
    // Load persisted cache from localStorage on initialization
    if (this.useLocalStorage) {
      this.loadFromStorage();
    }
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__cache_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, CacheEntry<unknown>>;
        const now = Date.now();
        
        // Only load non-expired entries
        Object.entries(parsed).forEach(([key, entry]) => {
          if (entry.expiresAt > now) {
            this.memoryCache.set(key, entry);
          }
        });
      }
    } catch {
      // If loading fails, start with empty cache
      console.warn('Failed to load cache from localStorage');
    }
  }

  /**
   * Persist cache to localStorage
   */
  private saveToStorage(): void {
    if (!this.useLocalStorage) return;

    try {
      const cacheObject: Record<string, CacheEntry<unknown>> = {};
      const now = Date.now();
      
      // Only save non-expired entries
      this.memoryCache.forEach((entry, key) => {
        if (entry.expiresAt > now) {
          cacheObject[key] = entry;
        }
      });
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObject));
    } catch (error) {
      // Handle storage quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing old entries');
        this.clearExpired();
        // Try again after clearing
        try {
          const cacheObject: Record<string, CacheEntry<unknown>> = {};
          this.memoryCache.forEach((entry, key) => {
            cacheObject[key] = entry;
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObject));
        } catch {
          // If still fails, disable localStorage
          this.useLocalStorage = false;
        }
      }
    }
  }

  /**
   * Clear expired entries from cache
   */
  private clearExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.memoryCache.forEach((entry, key) => {
      if (entry.expiresAt <= now) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.memoryCache.delete(key));
  }

  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      this.saveToStorage();
      return null;
    }
    
    return entry.value;
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): void {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttl,
    };
    
    this.memoryCache.set(key, entry);
    this.saveToStorage();
  }

  /**
   * Check if a key exists in cache and is not expired
   * @param key - Cache key
   * @returns true if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      this.saveToStorage();
      return false;
    }
    
    return true;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.memoryCache.clear();
    
    if (this.useLocalStorage) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore errors when clearing
      }
    }
  }

  /**
   * Get the number of cached entries (for debugging/testing)
   */
  get size(): number {
    return this.memoryCache.size;
  }
}

// Export singleton instance for application use
export const cacheService = new CacheService();

// Export class for testing purposes
export { CacheService };

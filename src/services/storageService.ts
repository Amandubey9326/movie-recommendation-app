/**
 * Storage Service
 * 
 * Handles local storage operations for user data including:
 * - Watchlist management
 * - Favorites management
 * - Viewing history tracking
 * - Theme preference persistence
 * 
 * Includes error handling for:
 * - Storage quota exceeded
 * - Corrupted data
 * - Storage unavailable (falls back to in-memory state)
 * 
 * Validates: Requirements 8.3, 10.2, 10.3, 10.4, 11.4, 11.5
 */

export interface ViewingHistoryItem {
  movieId: number;
  viewedAt: string;
}

export type ThemePreference = 'dark' | 'light';

// Storage keys
const STORAGE_KEYS = {
  WATCHLIST: 'movie_app_watchlist',
  FAVORITES: 'movie_app_favorites',
  HISTORY: 'movie_app_history',
  THEME: 'movie_app_theme',
} as const;

// Maximum history items to prevent storage quota issues
const MAX_HISTORY_ITEMS = 100;

class StorageService {
  private inMemoryWatchlist: number[] = [];
  private inMemoryFavorites: number[] = [];
  private inMemoryHistory: ViewingHistoryItem[] = [];
  private inMemoryTheme: ThemePreference = 'dark';
  private storageAvailable: boolean;

  constructor() {
    this.storageAvailable = this.isLocalStorageAvailable();
    this.loadFromStorage();
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Load all data from localStorage into memory
   */
  private loadFromStorage(): void {
    if (!this.storageAvailable) return;

    this.inMemoryWatchlist = this.loadArray<number>(STORAGE_KEYS.WATCHLIST);
    this.inMemoryFavorites = this.loadArray<number>(STORAGE_KEYS.FAVORITES);
    this.inMemoryHistory = this.loadArray<ViewingHistoryItem>(STORAGE_KEYS.HISTORY);
    this.inMemoryTheme = this.loadTheme();
  }

  /**
   * Load and validate an array from localStorage
   */
  private loadArray<T>(key: string): T[] {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        console.warn(`Corrupted data for ${key}, resetting to default`);
        localStorage.removeItem(key);
        return [];
      }
      return parsed;
    } catch {
      console.warn(`Failed to load ${key} from localStorage, resetting to default`);
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore removal errors
      }
      return [];
    }
  }

  /**
   * Load theme preference from localStorage
   */
  private loadTheme(): ThemePreference {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      // Invalid or missing theme, return default
      return 'dark';
    } catch {
      return 'dark';
    }
  }

  /**
   * Save data to localStorage with error handling
   */
  private saveToStorage(key: string, data: unknown): void {
    if (!this.storageAvailable) return;

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded');
        this.handleQuotaExceeded();
        // Retry save after cleanup
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch {
          console.error('Failed to save after quota cleanup');
        }
      } else {
        console.error(`Failed to save ${key} to localStorage:`, error);
      }
    }
  }

  /**
   * Handle storage quota exceeded by clearing old history entries
   */
  private handleQuotaExceeded(): void {
    // Clear oldest history entries first
    if (this.inMemoryHistory.length > 10) {
      this.inMemoryHistory = this.inMemoryHistory.slice(-10);
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(this.inMemoryHistory));
      } catch {
        // If still failing, clear history entirely
        this.inMemoryHistory = [];
        try {
          localStorage.removeItem(STORAGE_KEYS.HISTORY);
        } catch {
          // Ignore
        }
      }
    }
  }

  // ==================== Watchlist Methods ====================

  /**
   * Get all movie IDs in the watchlist
   */
  getWatchlist(): number[] {
    return [...this.inMemoryWatchlist];
  }

  /**
   * Add a movie to the watchlist
   */
  addToWatchlist(movieId: number): void {
    if (!this.inMemoryWatchlist.includes(movieId)) {
      this.inMemoryWatchlist.push(movieId);
      this.saveToStorage(STORAGE_KEYS.WATCHLIST, this.inMemoryWatchlist);
    }
  }

  /**
   * Remove a movie from the watchlist
   */
  removeFromWatchlist(movieId: number): void {
    const index = this.inMemoryWatchlist.indexOf(movieId);
    if (index !== -1) {
      this.inMemoryWatchlist.splice(index, 1);
      this.saveToStorage(STORAGE_KEYS.WATCHLIST, this.inMemoryWatchlist);
    }
  }

  // ==================== Favorites Methods ====================

  /**
   * Get all movie IDs in favorites
   */
  getFavorites(): number[] {
    return [...this.inMemoryFavorites];
  }

  /**
   * Add a movie to favorites
   */
  addToFavorites(movieId: number): void {
    if (!this.inMemoryFavorites.includes(movieId)) {
      this.inMemoryFavorites.push(movieId);
      this.saveToStorage(STORAGE_KEYS.FAVORITES, this.inMemoryFavorites);
    }
  }

  /**
   * Remove a movie from favorites
   */
  removeFromFavorites(movieId: number): void {
    const index = this.inMemoryFavorites.indexOf(movieId);
    if (index !== -1) {
      this.inMemoryFavorites.splice(index, 1);
      this.saveToStorage(STORAGE_KEYS.FAVORITES, this.inMemoryFavorites);
    }
  }

  // ==================== Viewing History Methods ====================

  /**
   * Get viewing history
   */
  getViewingHistory(): ViewingHistoryItem[] {
    return [...this.inMemoryHistory];
  }

  /**
   * Add a movie to viewing history
   * Updates the viewedAt timestamp if the movie already exists
   */
  addToHistory(movieId: number): void {
    const now = new Date().toISOString();
    
    // Remove existing entry for this movie if present
    const existingIndex = this.inMemoryHistory.findIndex(
      item => item.movieId === movieId
    );
    if (existingIndex !== -1) {
      this.inMemoryHistory.splice(existingIndex, 1);
    }

    // Add new entry at the end (most recent)
    this.inMemoryHistory.push({
      movieId,
      viewedAt: now,
    });

    // Trim history if it exceeds max items
    if (this.inMemoryHistory.length > MAX_HISTORY_ITEMS) {
      this.inMemoryHistory = this.inMemoryHistory.slice(-MAX_HISTORY_ITEMS);
    }

    this.saveToStorage(STORAGE_KEYS.HISTORY, this.inMemoryHistory);
  }

  // ==================== Theme Methods ====================

  /**
   * Get the current theme preference
   */
  getThemePreference(): ThemePreference {
    return this.inMemoryTheme;
  }

  /**
   * Set the theme preference
   */
  setThemePreference(theme: ThemePreference): void {
    this.inMemoryTheme = theme;
    
    if (!this.storageAvailable) return;

    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }

  // ==================== Utility Methods ====================

  /**
   * Clear all stored data (useful for testing or user logout)
   */
  clearAll(): void {
    this.inMemoryWatchlist = [];
    this.inMemoryFavorites = [];
    this.inMemoryHistory = [];
    this.inMemoryTheme = 'dark';

    if (!this.storageAvailable) return;

    try {
      localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
      localStorage.removeItem(STORAGE_KEYS.FAVORITES);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.THEME);
    } catch {
      // Ignore errors when clearing
    }
  }

  /**
   * Check if storage is available
   */
  isStorageAvailable(): boolean {
    return this.storageAvailable;
  }
}

// Export singleton instance for application use
export const storageService = new StorageService();

// Export class for testing purposes
export { StorageService };

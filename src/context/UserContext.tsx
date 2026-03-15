/**
 * User Context
 *
 * Provides user preferences state management for the application with:
 * - Watchlist management (add/remove movies to watch later)
 * - Favorites management (add/remove favorite movies)
 * - Viewing history tracking (recently viewed movies with timestamps)
 * - Persistence to local storage via Storage Service
 *
 * Validates: Requirements 8.1, 8.2, 10.2, 10.3, 10.4
 */

import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  storageService,
  type ViewingHistoryItem,
} from '@services/storageService';

export interface UserContextValue {
  // Watchlist state and methods
  watchlist: number[];
  isInWatchlist: (movieId: number) => boolean;
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  toggleWatchlist: (movieId: number) => void;

  // Favorites state and methods
  favorites: number[];
  isInFavorites: (movieId: number) => boolean;
  addToFavorites: (movieId: number) => void;
  removeFromFavorites: (movieId: number) => void;
  toggleFavorites: (movieId: number) => void;

  // Viewing history state and methods
  viewingHistory: ViewingHistoryItem[];
  addToHistory: (movieId: number) => void;
  getRecentMovieIds: () => number[];
}

export const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  // Initialize state from storage
  const [watchlist, setWatchlist] = useState<number[]>(() => {
    return storageService.getWatchlist();
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    return storageService.getFavorites();
  });

  const [viewingHistory, setViewingHistory] = useState<ViewingHistoryItem[]>(() => {
    return storageService.getViewingHistory();
  });

  // ==================== Watchlist Methods ====================

  /**
   * Check if a movie is in the watchlist
   * Validates: Requirements 8.2
   */
  const isInWatchlist = useCallback(
    (movieId: number): boolean => {
      return watchlist.includes(movieId);
    },
    [watchlist]
  );

  /**
   * Add a movie to the watchlist
   * Validates: Requirements 8.1
   */
  const addToWatchlist = useCallback((movieId: number): void => {
    storageService.addToWatchlist(movieId);
    setWatchlist(storageService.getWatchlist());
  }, []);

  /**
   * Remove a movie from the watchlist
   * Validates: Requirements 8.2
   */
  const removeFromWatchlist = useCallback((movieId: number): void => {
    storageService.removeFromWatchlist(movieId);
    setWatchlist(storageService.getWatchlist());
  }, []);

  /**
   * Toggle a movie's watchlist status
   * Validates: Requirements 8.1, 8.2
   */
  const toggleWatchlist = useCallback(
    (movieId: number): void => {
      if (watchlist.includes(movieId)) {
        removeFromWatchlist(movieId);
      } else {
        addToWatchlist(movieId);
      }
    },
    [watchlist, addToWatchlist, removeFromWatchlist]
  );

  // ==================== Favorites Methods ====================

  /**
   * Check if a movie is in favorites
   * Validates: Requirements 10.2
   */
  const isInFavorites = useCallback(
    (movieId: number): boolean => {
      return favorites.includes(movieId);
    },
    [favorites]
  );

  /**
   * Add a movie to favorites
   * Validates: Requirements 10.2
   */
  const addToFavorites = useCallback((movieId: number): void => {
    storageService.addToFavorites(movieId);
    setFavorites(storageService.getFavorites());
  }, []);

  /**
   * Remove a movie from favorites
   * Validates: Requirements 10.2
   */
  const removeFromFavorites = useCallback((movieId: number): void => {
    storageService.removeFromFavorites(movieId);
    setFavorites(storageService.getFavorites());
  }, []);

  /**
   * Toggle a movie's favorites status
   * Validates: Requirements 10.2
   */
  const toggleFavorites = useCallback(
    (movieId: number): void => {
      if (favorites.includes(movieId)) {
        removeFromFavorites(movieId);
      } else {
        addToFavorites(movieId);
      }
    },
    [favorites, addToFavorites, removeFromFavorites]
  );

  // ==================== Viewing History Methods ====================

  /**
   * Add a movie to viewing history
   * Validates: Requirements 10.4
   */
  const addToHistory = useCallback((movieId: number): void => {
    storageService.addToHistory(movieId);
    setViewingHistory(storageService.getViewingHistory());
  }, []);

  /**
   * Get list of movie IDs from viewing history (most recent first)
   * Validates: Requirements 10.4
   */
  const getRecentMovieIds = useCallback((): number[] => {
    return [...viewingHistory]
      .reverse()
      .map((item) => item.movieId);
  }, [viewingHistory]);

  const value: UserContextValue = {
    // Watchlist
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,

    // Favorites
    favorites,
    isInFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorites,

    // Viewing history
    viewingHistory,
    addToHistory,
    getRecentMovieIds,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

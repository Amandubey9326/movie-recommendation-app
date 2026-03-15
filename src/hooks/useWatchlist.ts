/**
 * useWatchlist Hook
 *
 * Custom hook for accessing watchlist functionality from UserContext with:
 * - Current watchlist state
 * - Add, remove, and toggle methods
 * - isInWatchlist check method
 *
 * Validates: Requirements 8.1, 8.2
 */

import { useContext } from 'react';
import { UserContext } from '@context/UserContext';

export interface UseWatchlistReturn {
  watchlist: number[];
  isInWatchlist: (movieId: number) => boolean;
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  toggleWatchlist: (movieId: number) => void;
}

/**
 * Hook to access watchlist functionality from UserContext
 * @returns UseWatchlistReturn with watchlist state and methods
 * @throws Error if used outside UserProvider
 */
export function useWatchlist(): UseWatchlistReturn {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error('useWatchlist must be used within a UserProvider');
  }

  return {
    watchlist: context.watchlist,
    isInWatchlist: context.isInWatchlist,
    addToWatchlist: context.addToWatchlist,
    removeFromWatchlist: context.removeFromWatchlist,
    toggleWatchlist: context.toggleWatchlist,
  };
}

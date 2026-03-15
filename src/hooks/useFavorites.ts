/**
 * useFavorites Hook
 *
 * Custom hook for accessing favorites functionality from UserContext with:
 * - Current favorites state
 * - Add, remove, and toggle methods
 * - isInFavorites check method
 *
 * Validates: Requirements 10.2
 */

import { useContext } from 'react';
import { UserContext } from '@context/UserContext';

export interface UseFavoritesReturn {
  favorites: number[];
  isInFavorites: (movieId: number) => boolean;
  addToFavorites: (movieId: number) => void;
  removeFromFavorites: (movieId: number) => void;
  toggleFavorites: (movieId: number) => void;
}

/**
 * Hook to access favorites functionality from UserContext
 * @returns UseFavoritesReturn with favorites state and methods
 * @throws Error if used outside UserProvider
 */
export function useFavorites(): UseFavoritesReturn {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error('useFavorites must be used within a UserProvider');
  }

  return {
    favorites: context.favorites,
    isInFavorites: context.isInFavorites,
    addToFavorites: context.addToFavorites,
    removeFromFavorites: context.removeFromFavorites,
    toggleFavorites: context.toggleFavorites,
  };
}

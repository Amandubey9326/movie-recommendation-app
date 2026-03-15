/**
 * FavoritesSection Component
 *
 * Display user's favorites collection.
 * Validates: Requirements 10.2, 10.5
 */

import type { Movie } from '@services/tmdbService';
import { Carousel } from '@components/common/Carousel';

interface FavoritesSectionProps {
  movies: Movie[];
  loading?: boolean;
}

export function FavoritesSection({ movies, loading }: FavoritesSectionProps) {
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 px-4">Favorites</h2>
        <div className="flex gap-4 px-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-44 h-64 bg-dark-card rounded-xl shimmer flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Favorites</h2>
        <div className="glass-card p-8 text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-400">No favorites yet. Start adding movies you love!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Carousel title="Favorites" movies={movies} />
    </div>
  );
}

export default FavoritesSection;
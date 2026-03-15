/**
 * WatchlistSection Component
 *
 * Display user's watchlist collection.
 * Validates: Requirements 10.3, 10.5
 */

import type { Movie } from '@services/tmdbService';
import { Carousel } from '@components/common/Carousel';

interface WatchlistSectionProps {
  movies: Movie[];
  loading?: boolean;
}

export function WatchlistSection({ movies, loading }: WatchlistSectionProps) {
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 px-4">Watchlist</h2>
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
        <h2 className="text-2xl font-bold text-white mb-4">Watchlist</h2>
        <div className="glass-card p-8 text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-gray-400">Your watchlist is empty. Add movies to watch later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Carousel title="Watchlist" movies={movies} />
    </div>
  );
}

export default WatchlistSection;
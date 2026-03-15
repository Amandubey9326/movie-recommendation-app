/**
 * HistorySection Component
 *
 * Display recently viewed movies.
 * Validates: Requirements 10.4, 10.5
 */

import type { Movie } from '@services/tmdbService';
import { Carousel } from '@components/common/Carousel';

interface HistorySectionProps {
  movies: Movie[];
  loading?: boolean;
}

export function HistorySection({ movies, loading }: HistorySectionProps) {
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4 px-4">Recently Viewed</h2>
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
        <h2 className="text-2xl font-bold text-white mb-4">Recently Viewed</h2>
        <div className="glass-card p-8 text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-400">No viewing history yet. Start exploring movies!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Carousel title="Recently Viewed" movies={movies} />
    </div>
  );
}

export default HistorySection;
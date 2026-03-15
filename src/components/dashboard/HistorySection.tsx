/**
 * HistorySection Component
 *
 * Display recently viewed movies with polished UI.
 * Validates: Requirements 10.4, 10.5
 */

import type { Movie } from '@services/tmdbService';
import { Carousel } from '@components/common/Carousel';
import { Link } from 'react-router-dom';

interface HistorySectionProps {
  movies: Movie[];
  loading?: boolean;
}

export function HistorySection({ movies, loading }: HistorySectionProps) {
  if (loading) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Recently Viewed</h2>
        </div>
        <div className="flex gap-4 px-1 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-44 h-64 bg-dark-card rounded-xl shimmer flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Recently Viewed</h2>
        </div>
        <div className="glass-card p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No viewing history</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Your recently viewed movies will appear here. Start exploring!
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Browse Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2 px-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Recently Viewed</h2>
        <span className="ml-2 px-2.5 py-0.5 bg-purple-500/20 text-purple-400 text-sm font-medium rounded-full">
          {movies.length}
        </span>
      </div>
      <Carousel title="" movies={movies} />
    </div>
  );
}

export default HistorySection;

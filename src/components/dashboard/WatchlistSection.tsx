/**
 * WatchlistSection Component
 *
 * Display user's watchlist collection with polished UI.
 * Validates: Requirements 10.3, 10.5
 */

import type { Movie } from '@services/tmdbService';
import { Carousel } from '@components/common/Carousel';
import { Link } from 'react-router-dom';

interface WatchlistSectionProps {
  movies: Movie[];
  loading?: boolean;
}

export function WatchlistSection({ movies, loading }: WatchlistSectionProps) {
  if (loading) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
        </div>
        <div className="glass-card p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Watchlist is empty</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Save movies to watch later by clicking the bookmark icon on any movie!
          </p>
          <Link 
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2 px-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">My Watchlist</h2>
        <span className="ml-2 px-2.5 py-0.5 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full">
          {movies.length}
        </span>
      </div>
      <Carousel title="" movies={movies} />
    </div>
  );
}

export default WatchlistSection;

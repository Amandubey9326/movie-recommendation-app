/**
 * FavoritesSection Component
 *
 * Display user's favorites collection with polished UI.
 * Validates: Requirements 10.2, 10.5
 */

import type { Movie } from '@services/tmdbService';
import { Carousel } from '@components/common/Carousel';
import { Link } from 'react-router-dom';

interface FavoritesSectionProps {
  movies: Movie[];
  loading?: boolean;
}

export function FavoritesSection({ movies, loading }: FavoritesSectionProps) {
  if (loading) {
    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">My Favorites</h2>
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">My Favorites</h2>
        </div>
        <div className="glass-card p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-pink-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Start building your collection by clicking the heart icon on movies you love!
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Discover Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2 px-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">My Favorites</h2>
        <span className="ml-2 px-2.5 py-0.5 bg-pink-500/20 text-pink-400 text-sm font-medium rounded-full">
          {movies.length}
        </span>
      </div>
      <Carousel title="" movies={movies} />
    </div>
  );
}

export default FavoritesSection;

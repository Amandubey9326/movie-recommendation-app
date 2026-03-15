/**
 * HeroSection Component
 *
 * Featured movie banner with backdrop image and action buttons.
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 */

import type { Movie } from '@services/tmdbService';

interface HeroSectionProps {
  movie: Movie | null;
  onWatchTrailer: () => void;
  onAddToWatchlist: () => void;
  isInWatchlist?: boolean;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

export function HeroSection({ movie, onWatchTrailer, onAddToWatchlist, isInWatchlist }: HeroSectionProps) {
  if (!movie) {
    return (
      <div className="h-[70vh] bg-dark-surface animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading featured movie...</p>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}`
    : '/placeholder-backdrop.jpg';

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Backdrop Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/80 to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
        <div className="max-w-2xl animate-slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {movie.title}
          </h1>
          <p className="text-gray-300 text-lg mb-6 line-clamp-3">
            {movie.overview}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onWatchTrailer}
              className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Watch Trailer
            </button>
            <button
              onClick={onAddToWatchlist}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg backdrop-blur-sm transition-colors"
            >
              {isInWatchlist ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  In Watchlist
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Watchlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
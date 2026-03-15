/**
 * SearchResults Component
 *
 * Display results as animated MovieCard grid with enhanced empty states.
 * Validates: Requirements 9.2, 9.3
 */

import { useNavigate } from 'react-router-dom';
import type { Movie } from '@services/tmdbService';
import { MovieCard } from '@components/common/MovieCard';

interface SearchResultsProps {
  movies: Movie[];
  loading?: boolean;
  query: string;
}

export function SearchResults({ movies, loading, query }: SearchResultsProps) {
  const navigate = useNavigate();

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-full aspect-[2/3] bg-dark-card rounded-xl shimmer" />
          ))}
        </div>
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Searching...
          </div>
        </div>
      </div>
    );
  }

  if (query && movies.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-white mb-3">No movies found</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          We couldn't find any movies matching "<span className="text-accent-primary">{query}</span>". 
          Try checking your spelling or search for something else.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-gray-500 text-sm">Try searching for:</span>
          {['Action', 'Comedy', 'Drama', 'Sci-Fi'].map((genre) => (
            <span key={genre} className="px-3 py-1 text-sm bg-white/5 text-gray-400 rounded-full">
              {genre} movies
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-accent-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-white mb-3">Discover Amazing Movies</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Start typing to search through millions of movies. Find classics, new releases, and hidden gems.
        </p>
        
        {/* Feature highlights */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <p className="text-sm text-gray-400">Save favorites</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <p className="text-sm text-gray-400">Build watchlist</p>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <p className="text-sm text-gray-400">Get recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie, index) => (
        <div 
          key={movie.id} 
          className="animate-fade-in" 
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <MovieCard movie={movie} onClick={handleMovieClick} />
        </div>
      ))}
    </div>
  );
}

export default SearchResults;

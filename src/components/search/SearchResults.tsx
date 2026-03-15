/**
 * SearchResults Component
 *
 * Display results as animated MovieCard grid.
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-full aspect-[2/3] bg-dark-card rounded-xl shimmer" />
        ))}
      </div>
    );
  }

  if (query && movies.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
        <p className="text-gray-400">Try searching for a different movie title</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">Search for movies</h3>
        <p className="text-gray-400">Enter a movie title to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie, index) => (
        <div key={movie.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
          <MovieCard movie={movie} onClick={handleMovieClick} />
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
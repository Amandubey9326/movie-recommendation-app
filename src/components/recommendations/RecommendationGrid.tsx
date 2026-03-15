/**
 * RecommendationGrid Component
 *
 * Display minimum 20 recommended movies.
 * Validates: Requirements 6.4
 */

import { useNavigate } from 'react-router-dom';
import type { Movie } from '@services/tmdbService';
import { MovieCard } from '@components/common/MovieCard';

interface RecommendationGridProps {
  movies: Movie[];
  loading?: boolean;
}

export function RecommendationGrid({ movies, loading }: RecommendationGridProps) {
  const navigate = useNavigate();

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-full aspect-[2/3] bg-dark-card rounded-xl shimmer" />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2m0 2v2m0-2h10M7 4h10m0 0V2m0 2v2m0-2H7m10 0h2a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
        <p className="text-gray-400">Start watching movies to get personalized recommendations</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie, index) => (
        <div key={movie.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
          <MovieCard movie={movie} onClick={handleMovieClick} />
        </div>
      ))}
    </div>
  );
}

export default RecommendationGrid;
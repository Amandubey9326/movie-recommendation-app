/**
 * TrendingSection Component
 *
 * Carousel with trending movies from TMDB.
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 */

import { useNavigate } from 'react-router-dom';
import type { Movie } from '@services/tmdbService';
import { Carousel } from '@components/common/Carousel';

interface TrendingSectionProps {
  movies: Movie[];
  loading?: boolean;
}

export function TrendingSection({ movies, loading }: TrendingSectionProps) {
  const navigate = useNavigate();

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-white mb-4 px-4">Trending Now</h2>
        <div className="flex gap-4 px-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-44 h-64 bg-dark-card rounded-xl shimmer flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) return null;

  return (
    <section className="py-8">
      <Carousel
        title="Trending Now"
        movies={movies}
        onMovieClick={handleMovieClick}
      />
    </section>
  );
}

export default TrendingSection;

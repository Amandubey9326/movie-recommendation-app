/**
 * TopRatedSection Component
 *
 * Section with top-rated movies sorted by rating.
 * Validates: Requirements 4.1, 4.2, 4.3
 */

import { useNavigate } from 'react-router-dom';
import type { Movie } from '@services/tmdbService';
import { Carousel } from '@components/common/Carousel';

interface TopRatedSectionProps {
  movies: Movie[];
  loading?: boolean;
}

export function TopRatedSection({ movies, loading }: TopRatedSectionProps) {
  const navigate = useNavigate();

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  // Sort by rating descending
  const sortedMovies = [...movies].sort((a, b) => b.vote_average - a.vote_average);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-white mb-4 px-4">Top Rated</h2>
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
        title="Top Rated"
        movies={sortedMovies}
        onMovieClick={handleMovieClick}
      />
    </section>
  );
}

export default TopRatedSection;

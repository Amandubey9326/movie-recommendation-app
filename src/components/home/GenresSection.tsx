/**
 * GenresSection Component
 *
 * Genre category tabs with movies by selected genre.
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbService, type Movie } from '@services/tmdbService';
import { MovieCard } from '@components/common/MovieCard';

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10749, name: 'Romance' },
];

export function GenresSection() {
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0].id);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tmdbService.getByGenre(selectedGenre);
      setMovies(data.slice(0, 12));
    } catch (error) {
      console.error('Failed to fetch genre movies:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-white mb-6">Browse by Genre</h2>
      
      {/* Genre Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedGenre === genre.id
                ? 'bg-accent-primary text-white'
                : 'bg-dark-card text-gray-300 hover:bg-dark-border hover:text-white'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full aspect-[2/3] bg-dark-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
          ))}
        </div>
      )}
    </section>
  );
}

export default GenresSection;
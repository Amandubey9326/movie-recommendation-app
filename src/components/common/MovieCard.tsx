/**
 * MovieCard Component
 *
 * Card with poster, title, and rating display with glassmorphism overlay and 3D effects.
 * Validates: Requirements 4.2, 5.1, 5.2, 5.3, 5.4
 */

import { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '@services/tmdbService';
import { createTiltHandler } from '@three/MovieCard3D';
import { UserContext } from '@context/UserContext';

interface MovieCardProps {
  movie: Movie;
  showRating?: boolean;
  showFavorite?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (movieId: number) => void;
}

const sizeClasses = {
  small: 'w-32 h-48',
  medium: 'w-44 h-64',
  large: 'w-56 h-80',
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export function MovieCard({ movie, showRating = true, showFavorite = true, size = 'medium', onClick }: MovieCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const userContext = useContext(UserContext);

  const isFavorite = userContext?.favorites?.includes(movie.id) || false;

  // Apply 3D tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const { handleMouseMove, handleMouseLeave } = createTiltHandler(card, {
      maxTilt: 10,
      scale: 1.05,
      transitionDuration: 300,
    });

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick(movie.id);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      userContext?.removeFromFavorites(movie.id);
    } else {
      userContext?.addToFavorites(movie.id);
    }
  };

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : '/placeholder-poster.jpg';

  const rating = movie.vote_average?.toFixed(1) || 'N/A';
  const year = movie.release_date?.split('-')[0] || '';

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`${sizeClasses[size]} relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent-primary/20`}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Poster Image */}
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-3 glass-card m-2">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
            {movie.title}
          </h3>
          {year && (
            <p className="text-gray-400 text-xs">{year}</p>
          )}
        </div>
      </div>

      {/* Rating Badge */}
      {showRating && (
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <svg
            className="w-3 h-3 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-white text-xs font-medium">{rating}</span>
        </div>
      )}

      {/* Favorite Button */}
      {showFavorite && (
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 left-2 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isFavorite 
              ? 'bg-accent-primary text-white' 
              : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-accent-primary'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className="w-4 h-4"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default MovieCard;

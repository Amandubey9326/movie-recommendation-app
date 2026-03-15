/**
 * DetailsPage
 *
 * Movie details page with info, trailer, cast, and watchlist functionality.
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 8.1
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbService, type MovieDetails, type Credits, type Video } from '@services/tmdbService';
import { UserContext } from '@context/UserContext';
import { MovieInfo } from '@components/details/MovieInfo';
import { CastSection } from '@components/details/CastSection';
import { WatchlistButton } from '@components/details/WatchlistButton';
import { TrailerModal } from '@components/details/TrailerPlayer';
import { PageTransition } from '@components/common/PageTransition';

export function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const userContext = useContext(UserContext);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const movieId = parseInt(id, 10);
      const [movieData, creditsData, videosData] = await Promise.all([
        tmdbService.getMovieDetails(movieId),
        tmdbService.getMovieCredits(movieId),
        tmdbService.getMovieVideos(movieId),
      ]);
      setMovie(movieData);
      setCredits(creditsData);
      setVideos(videosData);
      // Add to viewing history
      userContext?.addToHistory(movieId);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    } finally {
      setLoading(false);
    }
  }, [id, userContext]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const backdropUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '';

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-64 md:w-80 h-96 bg-dark-card rounded-xl shimmer mx-auto md:mx-0" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-dark-card rounded shimmer w-3/4" />
              <div className="h-6 bg-dark-card rounded shimmer w-1/2" />
              <div className="h-32 bg-dark-card rounded shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Backdrop */}
        {backdropUrl && (
          <div className="fixed inset-0 -z-10">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg/90 to-dark-bg" />
          </div>
        )}

        <div className="pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <MovieInfo movie={movie} />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Watch Trailer
                </button>
              )}
              <WatchlistButton movieId={movie.id} />
            </div>

            <CastSection credits={credits} />
          </div>
        </div>

        {showTrailer && trailer && (
          <TrailerModal
            videoKey={trailer.key}
            isOpen={showTrailer}
            onClose={() => setShowTrailer(false)}
          />
        )}
      </div>
    </PageTransition>
  );
}

export default DetailsPage;
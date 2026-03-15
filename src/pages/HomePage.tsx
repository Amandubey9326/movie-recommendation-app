/**
 * HomePage
 *
 * Main landing page with hero, trending, genres, and top-rated sections.
 * Validates: Requirements 1.1, 2.1, 3.1, 4.1, 16.1
 */

import { useState, useEffect, useCallback } from 'react';
import { tmdbService, type Movie } from '@services/tmdbService';
import { useWatchlist } from '@hooks/useWatchlist';
import { HeroSection } from '@components/home/HeroSection';
import { TrendingSection } from '@components/home/TrendingSection';
import { GenresSection } from '@components/home/GenresSection';
import { TopRatedSection } from '@components/home/TopRatedSection';
import { PageTransition } from '@components/common/PageTransition';
import { TrailerModal } from '@components/details/TrailerPlayer';

export function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [trending, topRated] = await Promise.all([
        tmdbService.getTrending(),
        tmdbService.getTopRated(),
      ]);
      setTrendingMovies(trending);
      setTopRatedMovies(topRated);
      if (trending.length > 0) {
        setFeaturedMovie(trending[0]);
      }
    } catch (error) {
      console.error('Failed to fetch home page data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWatchTrailer = async () => {
    if (!featuredMovie) return;
    try {
      const videos = await tmdbService.getMovieVideos(featuredMovie.id);
      const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        setTrailerKey(trailer.key);
        setShowTrailer(true);
      }
    } catch (error) {
      console.error('Failed to fetch trailer:', error);
    }
  };

  const handleAddToWatchlist = () => {
    if (featuredMovie) {
      toggleWatchlist(featuredMovie.id);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <HeroSection
          movie={featuredMovie}
          onWatchTrailer={handleWatchTrailer}
          onAddToWatchlist={handleAddToWatchlist}
          isInWatchlist={featuredMovie ? isInWatchlist(featuredMovie.id) : false}
        />
        <div className="max-w-7xl mx-auto">
          <TrendingSection movies={trendingMovies} loading={loading} />
          <GenresSection />
          <TopRatedSection movies={topRatedMovies} loading={loading} />
        </div>
      </div>
      {showTrailer && trailerKey && (
        <TrailerModal videoKey={trailerKey} isOpen={showTrailer} onClose={() => setShowTrailer(false)} />
      )}
    </PageTransition>
  );
}

export default HomePage;
/**
 * DashboardPage
 *
 * User dashboard with profile, favorites, watchlist, and history.
 * Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { tmdbService, type Movie } from '@services/tmdbService';
import { UserContext } from '@context/UserContext';
import { ProfileSection } from '@components/dashboard/ProfileSection';
import { FavoritesSection } from '@components/dashboard/FavoritesSection';
import { WatchlistSection } from '@components/dashboard/WatchlistSection';
import { HistorySection } from '@components/dashboard/HistorySection';
import { PageTransition } from '@components/common/PageTransition';

export function DashboardPage() {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [historyMovies, setHistoryMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);

  const fetchMovieDetails = useCallback(async (ids: number[]): Promise<Movie[]> => {
    if (ids.length === 0) return [];
    const movies = await Promise.all(
      ids.slice(0, 20).map(async (id) => {
        try {
          const details = await tmdbService.getMovieDetails(id);
          // Convert MovieDetails to Movie format
          return {
            id: details.id,
            title: details.title,
            overview: details.overview,
            poster_path: details.poster_path,
            backdrop_path: details.backdrop_path,
            release_date: details.release_date,
            vote_average: details.vote_average,
            vote_count: details.vote_count,
            genre_ids: details.genres?.map(g => g.id) || [],
          } as Movie;
        } catch {
          return null;
        }
      })
    );
    return movies.filter((m): m is Movie => m !== null);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const favorites = userContext?.favorites || [];
      const watchlist = userContext?.watchlist || [];
      const historyIds = userContext?.getRecentMovieIds() || [];

      const [favMovies, watchMovies, histMovies] = await Promise.all([
        fetchMovieDetails(favorites),
        fetchMovieDetails(watchlist),
        fetchMovieDetails(historyIds),
      ]);

      setFavoriteMovies(favMovies);
      setWatchlistMovies(watchMovies);
      setHistoryMovies(histMovies);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [userContext, fetchMovieDetails]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
          <ProfileSection />
          <FavoritesSection movies={favoriteMovies} loading={loading} />
          <WatchlistSection movies={watchlistMovies} loading={loading} />
          <HistorySection movies={historyMovies} loading={loading} />
        </div>
      </div>
    </PageTransition>
  );
}

export default DashboardPage;
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

  const stats = [
    { 
      label: 'Favorites', 
      value: favoriteMovies.length, 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ),
      color: 'from-pink-500 to-rose-500'
    },
    { 
      label: 'Watchlist', 
      value: watchlistMovies.length, 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: 'Watched', 
      value: historyMovies.length, 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      ),
      color: 'from-purple-500 to-violet-500'
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
              <p className="text-gray-400">Manage your movie collections and preferences</p>
            </div>
            <button 
              onClick={fetchData}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              title="Refresh"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Profile Section */}
          <ProfileSection />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-default"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{loading ? '—' : stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Movie Sections */}
          <FavoritesSection movies={favoriteMovies} loading={loading} />
          <WatchlistSection movies={watchlistMovies} loading={loading} />
          <HistorySection movies={historyMovies} loading={loading} />
        </div>
      </div>
    </PageTransition>
  );
}

export default DashboardPage;

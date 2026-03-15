/**
 * RecommendationsPage
 *
 * AI-based movie recommendations with filters.
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { tmdbService, type Movie, type Genre } from '@services/tmdbService';
import { recommendationService, type RecommendationFilters } from '@services/recommendationService';
import { UserContext } from '@context/UserContext';
import { useDebounce } from '@hooks/useDebounce';
import { FilterPanel } from '@components/recommendations/FilterPanel';
import { RecommendationGrid } from '@components/recommendations/RecommendationGrid';
import { PageTransition } from '@components/common/PageTransition';

const defaultFilters: RecommendationFilters = {
  genre: null,
  yearFrom: null,
  yearTo: null,
  minRating: 0,
};

export function RecommendationsPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filters, setFilters] = useState<RecommendationFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const userContext = useContext(UserContext);
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    tmdbService.getGenres().then(setGenres).catch(console.error);
  }, []);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const viewingHistory = userContext?.viewingHistory || [];
      const favorites = userContext?.favorites || [];
      const results = await recommendationService.getRecommendations(
        viewingHistory,
        favorites,
        debouncedFilters
      );
      setMovies(results);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, userContext?.viewingHistory, userContext?.favorites]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Recommendations</h1>
          <p className="text-gray-400 mb-8">Personalized movie suggestions based on your preferences</p>
          <FilterPanel filters={filters} onFilterChange={setFilters} genres={genres} />
          <RecommendationGrid movies={movies} loading={loading} />
        </div>
      </div>
    </PageTransition>
  );
}

export default RecommendationsPage;
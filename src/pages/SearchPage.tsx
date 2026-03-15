/**
 * SearchPage
 *
 * Search page with SearchBar and SearchResults.
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 14.3
 */

import { useState, useEffect, useCallback } from 'react';
import { tmdbService, type Movie } from '@services/tmdbService';
import { useDebounce } from '@hooks/useDebounce';
import { SearchBar } from '@components/search/SearchBar';
import { SearchResults } from '@components/search/SearchResults';
import { PageTransition } from '@components/common/PageTransition';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const searchMovies = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      return;
    }
    setLoading(true);
    try {
      const results = await tmdbService.searchMovies(debouncedQuery);
      setMovies(results);
    } catch (error) {
      console.error('Search failed:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    searchMovies();
  }, [searchMovies]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Search Movies</h1>
          <div className="mb-8">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <SearchResults movies={movies} loading={loading} query={debouncedQuery} />
        </div>
      </div>
    </PageTransition>
  );
}

export default SearchPage;
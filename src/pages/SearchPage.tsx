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

const popularSearches = ['Avengers', 'Batman', 'Spider-Man', 'Inception', 'Interstellar', 'The Dark Knight'];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const debouncedQuery = useDebounce(query, 300);

  const searchMovies = useCallback(async () => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      setTotalResults(0);
      return;
    }
    setLoading(true);
    try {
      const results = await tmdbService.searchMovies(debouncedQuery);
      setMovies(results);
      setTotalResults(results.length);
    } catch (error) {
      console.error('Search failed:', error);
      setMovies([]);
      setTotalResults(0);
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
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Search Movies</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Find your favorite movies from millions of titles worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar value={query} onChange={setQuery} />
            
            {/* Popular Searches */}
            {!query && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-gray-500 text-sm">Popular:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count */}
          {debouncedQuery && !loading && movies.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                Found <span className="text-white font-semibold">{totalResults}</span> results for{' '}
                <span className="text-accent-primary">"{debouncedQuery}"</span>
              </p>
              <button
                onClick={() => setQuery('')}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear search
              </button>
            </div>
          )}

          {/* Results */}
          <SearchResults movies={movies} loading={loading} query={debouncedQuery} />
        </div>
      </div>
    </PageTransition>
  );
}

export default SearchPage;

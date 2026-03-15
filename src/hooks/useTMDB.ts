/**
 * useTMDB Hook
 *
 * Generic data fetching hook for TMDB API with:
 * - Loading state management
 * - Error state management
 * - Data state management
 * - Automatic refetch on dependency changes
 *
 * Validates: Requirements 12.4
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseTMDBState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseTMDBReturn<T> extends UseTMDBState<T> {
  refetch: () => Promise<void>;
}

/**
 * Generic hook for fetching data from TMDB service
 * @param fetchFn - Async function that fetches data
 * @param deps - Dependencies array to trigger refetch
 * @returns Object with data, loading, error states and refetch function
 */
export function useTMDB<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
): UseTMDBReturn<T> {
  const [state, setState] = useState<UseTMDBState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFn();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setState({ data: null, loading: false, error });
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...state,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching data with manual trigger (no automatic fetch on mount)
 * @param fetchFn - Async function that fetches data
 * @returns Object with data, loading, error states and fetch function
 */
export function useTMDBLazy<T>(
  fetchFn: () => Promise<T>
): UseTMDBReturn<T> & { fetch: () => Promise<void> } {
  const [state, setState] = useState<UseTMDBState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFn();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setState({ data: null, loading: false, error });
    }
  }, [fetchFn]);

  return {
    ...state,
    refetch: fetchData,
    fetch: fetchData,
  };
}

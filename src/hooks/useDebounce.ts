/**
 * useDebounce Hook
 *
 * Custom hook for debouncing values with configurable delay.
 * Useful for search inputs to prevent excessive API calls.
 *
 * Validates: Requirements 9.1
 */

import { useState, useEffect } from 'react';

/**
 * Default debounce delay for search inputs (300ms as per requirements)
 */
export const DEFAULT_DEBOUNCE_DELAY = 300;

/**
 * Hook to debounce a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = DEFAULT_DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value or delay changes before the timer fires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

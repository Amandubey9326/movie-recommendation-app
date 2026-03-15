/**
 * useTheme Hook
 *
 * Custom hook for accessing theme context with:
 * - Current theme state (dark/light)
 * - Toggle function to switch themes
 * - isDark convenience boolean
 *
 * Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5
 */

import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '@context/ThemeContext';

/**
 * Hook to access theme context
 * @returns ThemeContextValue with theme, toggleTheme, and isDark
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

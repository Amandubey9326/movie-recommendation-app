/**
 * Theme Context
 *
 * Provides theme state management for the application with:
 * - Dark/light mode toggle functionality
 * - Persistence to local storage via Storage Service
 * - Smooth 300ms theme transitions
 * - Default dark theme on initial load
 *
 * Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  storageService,
  type ThemePreference,
} from '@services/storageService';

export interface ThemeContextValue {
  theme: ThemePreference;
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme from storage (defaults to 'dark' if not set)
  const [theme, setTheme] = useState<ThemePreference>(() => {
    return storageService.getThemePreference();
  });

  /**
   * Apply theme to document and enable smooth transitions
   * Validates: Requirements 11.3 (300ms transition)
   */
  useEffect(() => {
    const root = document.documentElement;

    // Add transition class for smooth theme changes
    root.style.setProperty('transition', 'background-color 300ms ease, color 300ms ease');

    // Apply theme class to document
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Set color-scheme for native elements
    root.style.colorScheme = theme;
  }, [theme]);

  /**
   * Toggle between dark and light themes
   * Validates: Requirements 11.2, 11.4
   */
  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const newTheme: ThemePreference = currentTheme === 'dark' ? 'light' : 'dark';
      // Persist to storage
      storageService.setThemePreference(newTheme);
      return newTheme;
    });
  }, []);

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

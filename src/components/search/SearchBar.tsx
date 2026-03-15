/**
 * SearchBar Component
 *
 * Enhanced search input with animations and keyboard shortcuts.
 * Validates: Requirements 9.1
 */

import { useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search for movies, actors, directors...' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl opacity-0 group-focus-within:opacity-50 blur transition-opacity duration-300" />
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-6 h-6 text-gray-400 group-focus-within:text-accent-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-14 pr-24 py-5 bg-dark-card border border-dark-border rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-accent-primary transition-all duration-300"
        />
        
        {value ? (
          <button
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Clear</span>
              <div className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm">⌘</span>K
            </kbd>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;

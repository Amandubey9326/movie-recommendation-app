/**
 * WatchlistButton Component
 *
 * Toggle button with add/remove states for watchlist.
 * Validates: Requirements 8.1, 8.2, 8.4
 */

import { useState } from 'react';
import { useWatchlist } from '@hooks/useWatchlist';

interface WatchlistButtonProps {
  movieId: number;
}

export function WatchlistButton({ movieId }: WatchlistButtonProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [animating, setAnimating] = useState(false);
  const inWatchlist = isInWatchlist(movieId);

  const handleClick = () => {
    setAnimating(true);
    toggleWatchlist(movieId);
    setTimeout(() => setAnimating(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
        inWatchlist
          ? 'bg-accent-primary text-white hover:bg-accent-hover'
          : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
      } ${animating ? 'scale-95' : 'scale-100'}`}
    >
      {inWatchlist ? (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          In Watchlist
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add to Watchlist
        </>
      )}
    </button>
  );
}

export default WatchlistButton;
/**
 * FilterPanel Component
 *
 * Genre dropdown, year range inputs, and rating slider.
 * Validates: Requirements 6.2, 6.3
 */

import type { Genre } from '@services/tmdbService';
import type { RecommendationFilters } from '@services/recommendationService';

interface FilterPanelProps {
  filters: RecommendationFilters;
  onFilterChange: (filters: RecommendationFilters) => void;
  genres: Genre[];
}

const currentYear = new Date().getFullYear();

export function FilterPanel({ filters, onFilterChange, genres }: FilterPanelProps) {
  const handleGenreChange = (genreId: number | null) => {
    onFilterChange({ ...filters, genre: genreId });
  };

  const handleYearFromChange = (year: number | null) => {
    onFilterChange({ ...filters, yearFrom: year });
  };

  const handleYearToChange = (year: number | null) => {
    onFilterChange({ ...filters, yearTo: year });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  return (
    <div className="glass-card p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Genre */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Genre</label>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleGenreChange(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent-primary"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </div>

        {/* Year From */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Year From</label>
          <input
            type="number"
            min="1900"
            max={currentYear}
            value={filters.yearFrom || ''}
            onChange={(e) => handleYearFromChange(e.target.value ? parseInt(e.target.value) : null)}
            placeholder="1900"
            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent-primary"
          />
        </div>

        {/* Year To */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Year To</label>
          <input
            type="number"
            min="1900"
            max={currentYear}
            value={filters.yearTo || ''}
            onChange={(e) => handleYearToChange(e.target.value ? parseInt(e.target.value) : null)}
            placeholder={currentYear.toString()}
            className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent-primary"
          />
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Min Rating: {filters.minRating}</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
            className="w-full accent-accent-primary"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
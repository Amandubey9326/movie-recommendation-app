/**
 * Recommendation Service
 * 
 * Generates personalized movie recommendations based on:
 * - User's viewing history (weighted by recency)
 * - User's favorites (higher weight)
 * - Applied filters (genre, year range, min rating)
 * 
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 */

import { tmdbService } from './tmdbService';
import type { Movie } from './tmdbService';
import type { ViewingHistoryItem } from './storageService';

export interface RecommendationFilters {
  genre: number | null;
  yearFrom: number | null;
  yearTo: number | null;
  minRating: number;
}

interface GenreScore {
  genreId: number;
  score: number;
}

// Minimum recommendations to display per page
const MIN_RECOMMENDATIONS = 20;

// Weight multipliers for scoring
const FAVORITE_WEIGHT = 3.0;
const RECENT_VIEW_WEIGHT = 2.0;
const OLDER_VIEW_WEIGHT = 1.0;

// Time threshold for "recent" views (7 days in milliseconds)
const RECENT_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Analyze genre preferences from movie IDs
 * Returns a map of genre ID to accumulated score
 */
async function analyzeGenrePreferences(
  viewingHistory: ViewingHistoryItem[],
  favorites: number[]
): Promise<Map<number, number>> {
  const genreScores = new Map<number, number>();
  const now = Date.now();

  // Process favorites with highest weight
  for (const movieId of favorites) {
    try {
      const movie = await tmdbService.getMovieDetails(movieId);
      if (movie.genres) {
        for (const genre of movie.genres) {
          const currentScore = genreScores.get(genre.id) || 0;
          genreScores.set(genre.id, currentScore + FAVORITE_WEIGHT);
        }
      }
    } catch {
      // Skip movies that can't be fetched
    }
  }

  // Process viewing history with recency-based weighting
  for (const historyItem of viewingHistory) {
    const viewedAt = new Date(historyItem.viewedAt).getTime();
    const isRecent = (now - viewedAt) < RECENT_THRESHOLD_MS;
    const weight = isRecent ? RECENT_VIEW_WEIGHT : OLDER_VIEW_WEIGHT;

    try {
      const movie = await tmdbService.getMovieDetails(historyItem.movieId);
      if (movie.genres) {
        for (const genre of movie.genres) {
          const currentScore = genreScores.get(genre.id) || 0;
          genreScores.set(genre.id, currentScore + weight);
        }
      }
    } catch {
      // Skip movies that can't be fetched
    }
  }

  return genreScores;
}

/**
 * Get top genres sorted by score
 */
function getTopGenres(genreScores: Map<number, number>, limit: number = 3): GenreScore[] {
  const scores: GenreScore[] = [];
  
  genreScores.forEach((score, genreId) => {
    scores.push({ genreId, score });
  });

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Apply filters to a list of movies
 */
function applyFilters(movies: Movie[], filters: RecommendationFilters): Movie[] {
  return movies.filter(movie => {
    // Filter by genre if specified
    if (filters.genre !== null) {
      if (!movie.genre_ids.includes(filters.genre)) {
        return false;
      }
    }

    // Filter by year range
    if (movie.release_date) {
      const releaseYear = new Date(movie.release_date).getFullYear();
      
      if (filters.yearFrom !== null && releaseYear < filters.yearFrom) {
        return false;
      }
      
      if (filters.yearTo !== null && releaseYear > filters.yearTo) {
        return false;
      }
    }

    // Filter by minimum rating
    if (movie.vote_average < filters.minRating) {
      return false;
    }

    return true;
  });
}

/**
 * Remove duplicate movies from array
 */
function deduplicateMovies(movies: Movie[]): Movie[] {
  const seen = new Set<number>();
  return movies.filter(movie => {
    if (seen.has(movie.id)) {
      return false;
    }
    seen.add(movie.id);
    return true;
  });
}

/**
 * Exclude movies that user has already seen or favorited
 */
function excludeKnownMovies(
  movies: Movie[],
  viewingHistory: number[],
  favorites: number[]
): Movie[] {
  const knownIds = new Set([...viewingHistory, ...favorites]);
  return movies.filter(movie => !knownIds.has(movie.id));
}

/**
 * Recommendation Service Class
 */
class RecommendationService {
  /**
   * Get personalized movie recommendations
   * 
   * Algorithm:
   * 1. Analyze viewing history and favorites for genre preferences
   * 2. Weight recent views higher than older ones
   * 3. Fetch movies from top preferred genres
   * 4. Apply user-specified filters
   * 5. Ensure minimum 20 recommendations
   */
  async getRecommendations(
    viewingHistory: ViewingHistoryItem[],
    favorites: number[],
    filters: RecommendationFilters
  ): Promise<Movie[]> {
    const viewingHistoryIds = viewingHistory.map(item => item.movieId);
    let recommendations: Movie[] = [];

    // Analyze genre preferences from user data
    const genreScores = await analyzeGenrePreferences(viewingHistory, favorites);
    const topGenres = getTopGenres(genreScores);

    // If user has preferences, fetch movies from preferred genres
    if (topGenres.length > 0) {
      for (const { genreId } of topGenres) {
        try {
          const genreMovies = await tmdbService.getByGenre(genreId);
          recommendations.push(...genreMovies);
        } catch {
          // Continue with other genres if one fails
        }
      }
    }

    // If not enough recommendations, supplement with trending and top-rated
    if (recommendations.length < MIN_RECOMMENDATIONS) {
      try {
        const trending = await tmdbService.getTrending();
        recommendations.push(...trending);
      } catch {
        // Continue without trending
      }
    }

    if (recommendations.length < MIN_RECOMMENDATIONS) {
      try {
        const topRated = await tmdbService.getTopRated();
        recommendations.push(...topRated);
      } catch {
        // Continue without top-rated
      }
    }

    // Remove duplicates
    recommendations = deduplicateMovies(recommendations);

    // Exclude movies user has already seen or favorited
    recommendations = excludeKnownMovies(
      recommendations,
      viewingHistoryIds,
      favorites
    );

    // Apply user filters
    recommendations = applyFilters(recommendations, filters);

    // Sort by vote average (best first)
    recommendations.sort((a, b) => b.vote_average - a.vote_average);

    // Ensure minimum recommendations count
    // If still not enough after filtering, relax filters and try again
    if (recommendations.length < MIN_RECOMMENDATIONS) {
      // Fetch additional movies without strict genre preference
      try {
        const additionalTrending = await tmdbService.getTrending();
        const additionalTopRated = await tmdbService.getTopRated();
        
        let additional = [...additionalTrending, ...additionalTopRated];
        additional = deduplicateMovies(additional);
        additional = excludeKnownMovies(additional, viewingHistoryIds, favorites);
        
        // Apply only rating filter for additional movies
        const relaxedFilters: RecommendationFilters = {
          genre: null,
          yearFrom: null,
          yearTo: null,
          minRating: filters.minRating,
        };
        additional = applyFilters(additional, relaxedFilters);
        
        // Add movies not already in recommendations
        const existingIds = new Set(recommendations.map(m => m.id));
        for (const movie of additional) {
          if (!existingIds.has(movie.id)) {
            recommendations.push(movie);
          }
        }
      } catch {
        // Continue with what we have
      }
    }

    return recommendations;
  }

  /**
   * Get genre preferences analysis for display
   * Returns sorted list of preferred genres with scores
   */
  async getGenrePreferences(
    viewingHistory: ViewingHistoryItem[],
    favorites: number[]
  ): Promise<GenreScore[]> {
    const genreScores = await analyzeGenrePreferences(viewingHistory, favorites);
    return getTopGenres(genreScores, 10);
  }

  /**
   * Check if a movie has genre overlap with user preferences
   * Used for validating recommendation relevance
   */
  async hasGenreOverlap(
    movie: Movie,
    viewingHistory: ViewingHistoryItem[],
    favorites: number[]
  ): Promise<boolean> {
    const genreScores = await analyzeGenrePreferences(viewingHistory, favorites);
    
    // If no preferences, any movie is considered relevant
    if (genreScores.size === 0) {
      return true;
    }

    // Check if movie has at least one genre in user preferences
    for (const genreId of movie.genre_ids) {
      if (genreScores.has(genreId)) {
        return true;
      }
    }

    return false;
  }
}

// Export singleton instance for application use
export const recommendationService = new RecommendationService();

// Export class for testing purposes
export { RecommendationService };

// Export helper functions for testing
export {
  analyzeGenrePreferences,
  getTopGenres,
  applyFilters,
  deduplicateMovies,
  excludeKnownMovies,
  MIN_RECOMMENDATIONS,
  FAVORITE_WEIGHT,
  RECENT_VIEW_WEIGHT,
  OLDER_VIEW_WEIGHT,
  RECENT_THRESHOLD_MS,
};

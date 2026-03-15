/**
 * TMDB Service
 * 
 * Handles all communication with The Movie Database (TMDB) API.
 * Integrates with Cache Service for response caching.
 * Implements error handling with retry logic and exponential backoff.
 * 
 * Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5
 */

import { cacheService, DEFAULT_TTL, EXTENDED_TTL } from './cacheService';

// TMDB API Configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

// Cache key prefixes
const CACHE_KEYS = {
  TRENDING: 'tmdb_trending',
  TOP_RATED: 'tmdb_top_rated',
  GENRES: 'tmdb_genres',
  BY_GENRE: 'tmdb_by_genre_',
  MOVIE_DETAILS: 'tmdb_movie_details_',
  MOVIE_CREDITS: 'tmdb_movie_credits_',
  MOVIE_VIDEOS: 'tmdb_movie_videos_',
  SEARCH: 'tmdb_search_',
};

// Data Models
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

// API Response Types
interface TMDBMovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface TMDBGenreListResponse {
  genres: Genre[];
}

interface TMDBCreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

interface TMDBVideosResponse {
  id: number;
  results: Video[];
}

// Custom Error Classes
export class TMDBError extends Error {
  statusCode: number;
  isRetryable: boolean;

  constructor(
    message: string,
    statusCode: number,
    isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'TMDBError';
    this.statusCode = statusCode;
    this.isRetryable = isRetryable;
  }
}

export class NetworkError extends TMDBError {
  constructor(message: string = 'Network error occurred') {
    super(message, 0, true);
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends TMDBError {
  constructor() {
    super('Invalid API key. Please check your TMDB API configuration.', 401, false);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends TMDBError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, false);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends TMDBError {
  constructor() {
    super('Rate limit exceeded. Please try again later.', 429, true);
    this.name = 'RateLimitError';
  }
}

export class ServerError extends TMDBError {
  constructor() {
    super('TMDB server error. Please try again later.', 500, true);
    this.name = 'ServerError';
  }
}

/**
 * Sleep utility for exponential backoff
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const getBackoffDelay = (attempt: number): number => {
  return INITIAL_BACKOFF_MS * Math.pow(2, attempt);
};

/**
 * Build URL with query parameters
 */
const buildUrl = (endpoint: string, params: Record<string, string | number> = {}): string => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  
  return url.toString();
};

/**
 * Handle API response errors
 */
const handleResponseError = (status: number, resource?: string): never => {
  switch (status) {
    case 401:
      throw new UnauthorizedError();
    case 404:
      throw new NotFoundError(resource);
    case 429:
      throw new RateLimitError();
    case 500:
    case 502:
    case 503:
    case 504:
      throw new ServerError();
    default:
      throw new TMDBError(`API request failed with status ${status}`, status, status >= 500);
  }
};

/**
 * Fetch with retry logic and exponential backoff
 */
async function fetchWithRetry<T>(
  url: string,
  resource?: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        handleResponseError(response.status, resource);
      }
      
      return await response.json() as T;
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      const isRetryable = 
        error instanceof NetworkError ||
        error instanceof RateLimitError ||
        error instanceof ServerError ||
        (error instanceof TMDBError && error.isRetryable) ||
        (error instanceof TypeError && error.message.includes('fetch'));
      
      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Wait with exponential backoff before retrying
      const delay = getBackoffDelay(attempt);
      await sleep(delay);
    }
  }
  
  throw lastError || new NetworkError('Request failed after retries');
}

/**
 * TMDB Service Class
 */
class TMDBService {
  /**
   * Get trending movies
   * Uses default TTL (5 minutes) for caching
   */
  async getTrending(): Promise<Movie[]> {
    const cacheKey = CACHE_KEYS.TRENDING;
    
    // Check cache first
    const cached = cacheService.get<Movie[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const url = buildUrl('/trending/movie/week');
    const response = await fetchWithRetry<TMDBMovieListResponse>(url, 'Trending movies');
    
    // Cache the results
    cacheService.set(cacheKey, response.results, DEFAULT_TTL);
    
    return response.results;
  }

  /**
   * Get top-rated movies
   * Uses default TTL (5 minutes) for caching
   */
  async getTopRated(): Promise<Movie[]> {
    const cacheKey = CACHE_KEYS.TOP_RATED;
    
    // Check cache first
    const cached = cacheService.get<Movie[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const url = buildUrl('/movie/top_rated');
    const response = await fetchWithRetry<TMDBMovieListResponse>(url, 'Top rated movies');
    
    // Cache the results
    cacheService.set(cacheKey, response.results, DEFAULT_TTL);
    
    return response.results;
  }

  /**
   * Get movies by genre
   * Uses default TTL (5 minutes) for caching
   */
  async getByGenre(genreId: number): Promise<Movie[]> {
    const cacheKey = `${CACHE_KEYS.BY_GENRE}${genreId}`;
    
    // Check cache first
    const cached = cacheService.get<Movie[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const url = buildUrl('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc',
    });
    const response = await fetchWithRetry<TMDBMovieListResponse>(url, `Movies for genre ${genreId}`);
    
    // Cache the results
    cacheService.set(cacheKey, response.results, DEFAULT_TTL);
    
    return response.results;
  }

  /**
   * Get movie details
   * Uses extended TTL (1 hour) for caching
   */
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const cacheKey = `${CACHE_KEYS.MOVIE_DETAILS}${movieId}`;
    
    // Check cache first
    const cached = cacheService.get<MovieDetails>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const url = buildUrl(`/movie/${movieId}`);
    const response = await fetchWithRetry<MovieDetails>(url, `Movie ${movieId}`);
    
    // Cache the results with extended TTL
    cacheService.set(cacheKey, response, EXTENDED_TTL);
    
    return response;
  }

  /**
   * Get movie credits (cast and crew)
   * Uses extended TTL (1 hour) for caching
   */
  async getMovieCredits(movieId: number): Promise<Credits> {
    const cacheKey = `${CACHE_KEYS.MOVIE_CREDITS}${movieId}`;
    
    // Check cache first
    const cached = cacheService.get<Credits>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const url = buildUrl(`/movie/${movieId}/credits`);
    const response = await fetchWithRetry<TMDBCreditsResponse>(url, `Credits for movie ${movieId}`);
    
    const credits: Credits = {
      cast: response.cast,
      crew: response.crew,
    };
    
    // Cache the results with extended TTL
    cacheService.set(cacheKey, credits, EXTENDED_TTL);
    
    return credits;
  }

  /**
   * Get movie videos (trailers, teasers, etc.)
   * Uses extended TTL (1 hour) for caching
   */
  async getMovieVideos(movieId: number): Promise<Video[]> {
    const cacheKey = `${CACHE_KEYS.MOVIE_VIDEOS}${movieId}`;
    
    // Check cache first
    const cached = cacheService.get<Video[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const url = buildUrl(`/movie/${movieId}/videos`);
    const response = await fetchWithRetry<TMDBVideosResponse>(url, `Videos for movie ${movieId}`);
    
    // Cache the results with extended TTL
    cacheService.set(cacheKey, response.results, EXTENDED_TTL);
    
    return response.results;
  }

  /**
   * Search movies by query
   * Uses default TTL (5 minutes) for caching
   */
  async searchMovies(query: string): Promise<Movie[]> {
    if (!query.trim()) {
      return [];
    }
    
    const normalizedQuery = query.trim().toLowerCase();
    const cacheKey = `${CACHE_KEYS.SEARCH}${normalizedQuery}`;
    
    // Check cache first
    const cached = cacheService.get<Movie[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const url = buildUrl('/search/movie', { query: normalizedQuery });
    const response = await fetchWithRetry<TMDBMovieListResponse>(url, `Search results for "${query}"`);
    
    // Cache the results
    cacheService.set(cacheKey, response.results, DEFAULT_TTL);
    
    return response.results;
  }

  /**
   * Get all movie genres
   * Uses extended TTL (1 hour) for caching since genres rarely change
   */
  async getGenres(): Promise<Genre[]> {
    const cacheKey = CACHE_KEYS.GENRES;
    
    // Check cache first
    const cached = cacheService.get<Genre[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const url = buildUrl('/genre/movie/list');
    const response = await fetchWithRetry<TMDBGenreListResponse>(url, 'Movie genres');
    
    // Cache the results with extended TTL
    cacheService.set(cacheKey, response.genres, EXTENDED_TTL);
    
    return response.genres;
  }

  /**
   * Get the official trailer for a movie (YouTube only)
   * Returns the first official trailer or the first video if no official trailer exists
   */
  async getMovieTrailer(movieId: number): Promise<Video | null> {
    const videos = await this.getMovieVideos(movieId);
    
    // Filter for YouTube trailers
    const youtubeVideos = videos.filter(v => v.site === 'YouTube');
    
    // Prefer official trailers
    const officialTrailer = youtubeVideos.find(
      v => v.type === 'Trailer' && v.name.toLowerCase().includes('official')
    );
    
    if (officialTrailer) {
      return officialTrailer;
    }
    
    // Fall back to any trailer
    const anyTrailer = youtubeVideos.find(v => v.type === 'Trailer');
    if (anyTrailer) {
      return anyTrailer;
    }
    
    // Fall back to any YouTube video
    return youtubeVideos[0] || null;
  }

  /**
   * Clear all TMDB-related cache entries
   */
  clearCache(): void {
    cacheService.clear();
  }
}

// Export singleton instance for application use
export const tmdbService = new TMDBService();

// Export class for testing purposes
export { TMDBService };

/**
 * Chatbot Service
 * 
 * AI-like movie chatbot that uses TMDB data to answer movie questions
 * and provide recommendations based on natural language input.
 */

import { tmdbService, type Movie } from './tmdbService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  movies?: Movie[];
  timestamp: Date;
}

const GENRE_MAP: Record<string, number> = {
  action: 28, adventure: 12, animation: 16, comedy: 35,
  crime: 80, documentary: 99, drama: 18, family: 10751,
  fantasy: 14, history: 36, horror: 27, music: 10402,
  mystery: 9648, romance: 10749, 'sci-fi': 878, 'science fiction': 878,
  thriller: 53, war: 10752, western: 37,
};

const MOOD_GENRE_MAP: Record<string, number[]> = {
  happy: [35, 10751, 16],
  sad: [18, 10749],
  excited: [28, 12, 878],
  scared: [27, 53],
  romantic: [10749, 35],
  bored: [28, 12, 878, 14],
  relaxed: [35, 16, 10751],
  nostalgic: [16, 10751, 14],
  adventurous: [12, 14, 878],
  thoughtful: [18, 36, 99],
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function detectGenre(input: string): number | null {
  const lower = input.toLowerCase();
  for (const [keyword, genreId] of Object.entries(GENRE_MAP)) {
    if (lower.includes(keyword)) return genreId;
  }
  return null;
}

function detectMood(input: string): string | null {
  const lower = input.toLowerCase();
  const moods = Object.keys(MOOD_GENRE_MAP);
  for (const mood of moods) {
    if (lower.includes(mood)) return mood;
  }
  // Common phrases
  if (lower.includes('cheer') || lower.includes('laugh') || lower.includes('fun')) return 'happy';
  if (lower.includes('cry') || lower.includes('emotional')) return 'sad';
  if (lower.includes('thrill') || lower.includes('adrenaline')) return 'excited';
  if (lower.includes('creep') || lower.includes('spooky') || lower.includes('horror')) return 'scared';
  if (lower.includes('love') || lower.includes('date night')) return 'romantic';
  if (lower.includes('think') || lower.includes('deep') || lower.includes('meaningful')) return 'thoughtful';
  return null;
}

function detectMovieTitle(input: string): string | null {
  const lower = input.toLowerCase();
  // "like X" or "similar to X"
  const likeMatch = lower.match(/(?:like|similar to|such as)\s+["']?([^"'?.!]+)/);
  if (likeMatch) return likeMatch[1].trim();
  // "about X"
  const aboutMatch = lower.match(/(?:about|related to)\s+["']?([^"'?.!]+)/);
  if (aboutMatch) return aboutMatch[1].trim();
  return null;
}

class ChatbotService {
  async processMessage(input: string): Promise<ChatMessage> {
    const lower = input.toLowerCase();

    // Greeting
    if (/^(hi|hello|hey|sup|yo)\b/.test(lower)) {
      return this.createBotMessage(
        "Hey! 🎬 I'm your movie buddy. Ask me things like:\n• \"Suggest an action movie\"\n• \"Movies like Inception\"\n• \"I'm feeling sad, what should I watch?\"\n• \"What's trending?\""
      );
    }

    // Trending
    if (lower.includes('trending') || lower.includes('popular') || lower.includes("what's hot")) {
      try {
        const movies = await tmdbService.getTrending();
        return this.createBotMessage("Here's what's trending right now 🔥", movies.slice(0, 6));
      } catch {
        return this.createBotMessage("Couldn't fetch trending movies right now. Try again in a bit!");
      }
    }

    // Top rated
    if (lower.includes('top rated') || lower.includes('best') || lower.includes('highest rated')) {
      try {
        const movies = await tmdbService.getTopRated();
        return this.createBotMessage("Here are the highest rated movies of all time ⭐", movies.slice(0, 6));
      } catch {
        return this.createBotMessage("Couldn't fetch top rated movies. Try again!");
      }
    }

    // Similar movies
    const movieTitle = detectMovieTitle(input);
    if (movieTitle) {
      try {
        const searchResults = await tmdbService.searchMovies(movieTitle);
        if (searchResults.length > 0) {
          const movie = searchResults[0];
          const genreId = movie.genre_ids[0];
          if (genreId) {
            const similar = await tmdbService.getByGenre(genreId);
            const filtered = similar.filter(m => m.id !== movie.id).slice(0, 6);
            return this.createBotMessage(
              `If you liked "${movie.title}", you might enjoy these 🎯`,
              filtered
            );
          }
        }
        return this.createBotMessage(`I couldn't find "${movieTitle}". Could you check the spelling?`);
      } catch {
        return this.createBotMessage("Something went wrong while searching. Try again!");
      }
    }

    // Mood-based
    const mood = detectMood(input);
    if (mood) {
      try {
        const genreIds = MOOD_GENRE_MAP[mood];
        const movies = await tmdbService.getByGenre(genreIds[0]);
        const moodEmojis: Record<string, string> = {
          happy: '😊', sad: '😢', excited: '🤩', scared: '😱',
          romantic: '💕', bored: '🎯', relaxed: '😌', nostalgic: '🥹',
          adventurous: '🗺️', thoughtful: '🤔',
        };
        return this.createBotMessage(
          `Feeling ${mood}? ${moodEmojis[mood] || '🎬'} Here are some perfect picks for your mood:`,
          movies.slice(0, 6)
        );
      } catch {
        return this.createBotMessage("Couldn't find mood-based recommendations. Try a different mood!");
      }
    }

    // Genre-based
    const genreId = detectGenre(input);
    if (genreId) {
      try {
        const movies = await tmdbService.getByGenre(genreId);
        const genreName = Object.entries(GENRE_MAP).find(([, id]) => id === genreId)?.[0] || 'that genre';
        return this.createBotMessage(
          `Here are some great ${genreName} movies for you 🎬`,
          movies.slice(0, 6)
        );
      } catch {
        return this.createBotMessage("Couldn't fetch movies for that genre. Try again!");
      }
    }

    // Search fallback
    if (lower.includes('search') || lower.includes('find') || lower.includes('show me')) {
      const query = input.replace(/^(search|find|show me|look up)\s*(for)?\s*/i, '').trim();
      if (query) {
        try {
          const movies = await tmdbService.searchMovies(query);
          if (movies.length > 0) {
            return this.createBotMessage(`Here's what I found for "${query}" 🔍`, movies.slice(0, 6));
          }
          return this.createBotMessage(`No results for "${query}". Try a different search term!`);
        } catch {
          return this.createBotMessage("Search failed. Please try again!");
        }
      }
    }

    // Default
    return this.createBotMessage(
      "I'm not sure what you're looking for. Try asking me:\n• \"Suggest a comedy movie\"\n• \"Movies like The Dark Knight\"\n• \"I'm feeling adventurous\"\n• \"What's trending?\"\n• \"Show me sci-fi movies\""
    );
  }

  private createBotMessage(content: string, movies?: Movie[]): ChatMessage {
    return {
      id: generateId(),
      role: 'bot',
      content,
      movies: movies || undefined,
      timestamp: new Date(),
    };
  }

  createUserMessage(content: string): ChatMessage {
    return {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
  }
}

export const chatbotService = new ChatbotService();

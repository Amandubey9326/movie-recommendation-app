/**
 * MoodPage - Mood-based Movie Recommendations
 * 
 * Users select their current mood and get personalized movie suggestions.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbService, type Movie } from '@services/tmdbService';
import { MovieCard } from '@components/common/MovieCard';
import { PageTransition } from '@components/common/PageTransition';

interface MoodOption {
  emoji: string;
  label: string;
  description: string;
  genreIds: number[];
  color: string;
}

const MOODS: MoodOption[] = [
  { emoji: '😊', label: 'Happy', description: 'Feel-good vibes', genreIds: [35, 10751], color: 'from-yellow-500 to-orange-500' },
  { emoji: '😢', label: 'Sad', description: 'Emotional stories', genreIds: [18, 10749], color: 'from-blue-500 to-indigo-500' },
  { emoji: '🤩', label: 'Excited', description: 'High energy thrills', genreIds: [28, 12], color: 'from-red-500 to-pink-500' },
  { emoji: '😱', label: 'Scared', description: 'Spine-chilling horror', genreIds: [27, 53], color: 'from-purple-700 to-gray-900' },
  { emoji: '💕', label: 'Romantic', description: 'Love is in the air', genreIds: [10749, 35], color: 'from-pink-500 to-rose-500' },
  { emoji: '🤔', label: 'Thoughtful', description: 'Mind-bending plots', genreIds: [878, 9648], color: 'from-cyan-500 to-blue-500' },
  { emoji: '😌', label: 'Relaxed', description: 'Chill and unwind', genreIds: [16, 10751], color: 'from-green-500 to-emerald-500' },
  { emoji: '🗺️', label: 'Adventurous', description: 'Epic journeys', genreIds: [12, 14], color: 'from-amber-500 to-yellow-600' },
  { emoji: '😂', label: 'Funny', description: 'Laugh out loud', genreIds: [35], color: 'from-orange-400 to-yellow-500' },
  { emoji: '🥹', label: 'Nostalgic', description: 'Classic favorites', genreIds: [10751, 14, 16], color: 'from-violet-500 to-purple-500' },
  { emoji: '💪', label: 'Motivated', description: 'Inspiring stories', genreIds: [18, 36], color: 'from-emerald-500 to-teal-500' },
  { emoji: '🌌', label: 'Curious', description: 'Explore the unknown', genreIds: [878, 99], color: 'from-indigo-500 to-violet-600' },
];

export function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectMood = useCallback(async (mood: MoodOption) => {
    setSelectedMood(mood);
    setLoading(true);
    setMovies([]);

    try {
      const allMovies: Movie[] = [];
      for (const genreId of mood.genreIds) {
        const genreMovies = await tmdbService.getByGenre(genreId);
        allMovies.push(...genreMovies);
      }
      // Deduplicate and shuffle
      const unique = Array.from(new Map(allMovies.map(m => [m.id, m])).values());
      const shuffled = unique.sort(() => Math.random() - 0.5);
      setMovies(shuffled.slice(0, 20));
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 mb-4">
              <span className="text-3xl">🎭</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">How are you feeling?</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Pick your mood and we'll find the perfect movies to match
            </p>
          </div>

          {/* Mood Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {MOODS.map((mood) => (
              <button
                key={mood.label}
                onClick={() => selectMood(mood)}
                className={`group relative p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                  selectedMood?.label === mood.label
                    ? `bg-gradient-to-br ${mood.color} shadow-lg shadow-white/10`
                    : 'glass-card hover:bg-white/10'
                }`}
              >
                <span className="text-3xl block mb-2">{mood.emoji}</span>
                <p className="text-white font-semibold text-sm">{mood.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{mood.description}</p>
              </button>
            ))}
          </div>

          {/* Results */}
          {selectedMood && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{selectedMood.emoji}</span>
                <h2 className="text-2xl font-bold text-white">
                  {selectedMood.label} Movies
                </h2>
                <button
                  onClick={() => { setSelectedMood(null); setMovies([]); }}
                  className="ml-auto text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Change mood
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-full aspect-[2/3] bg-dark-card rounded-xl shimmer" />
                  ))}
                </div>
              ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movies.map((movie, i) => (
                    <div key={movie.id} className="animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <MovieCard movie={movie} onClick={(id) => navigate(`/movie/${id}`)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400">No movies found for this mood. Try another!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default MoodPage;

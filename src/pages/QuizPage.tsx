/**
 * QuizPage - Movie Trivia Quiz
 * 
 * Fun movie trivia game using TMDB data.
 * Generates questions about movie ratings, release years, and more.
 */

import { useState, useCallback, useEffect } from 'react';
import { tmdbService, type Movie } from '@services/tmdbService';
import { PageTransition } from '@components/common/PageTransition';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  moviePoster?: string;
}

type QuizState = 'start' | 'playing' | 'result';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateRatingQuestion(movie: Movie, allMovies: Movie[]): QuizQuestion {
  const correctRating = movie.vote_average.toFixed(1);
  const fakeRatings = new Set<string>();
  fakeRatings.add(correctRating);
  while (fakeRatings.size < 4) {
    const fake = (Math.random() * 4 + 5).toFixed(1);
    if (fake !== correctRating) fakeRatings.add(fake);
  }
  const options = shuffleArray(Array.from(fakeRatings));
  return {
    question: `What is the TMDB rating of "${movie.title}"?`,
    options,
    correctIndex: options.indexOf(correctRating),
    moviePoster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : undefined,
  };
}

function generateYearQuestion(movie: Movie, _allMovies: Movie[]): QuizQuestion {
  const year = new Date(movie.release_date).getFullYear();
  const fakeYears = new Set<number>();
  fakeYears.add(year);
  while (fakeYears.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const fake = year + offset;
    if (fake > 1900 && fake !== year) fakeYears.add(fake);
  }
  const options = shuffleArray(Array.from(fakeYears).map(String));
  return {
    question: `When was "${movie.title}" released?`,
    options,
    correctIndex: options.indexOf(String(year)),
    moviePoster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : undefined,
  };
}

function generateHigherRatingQuestion(movieA: Movie, movieB: Movie): QuizQuestion {
  const higher = movieA.vote_average >= movieB.vote_average ? movieA : movieB;
  const options = shuffleArray([movieA.title, movieB.title]);
  return {
    question: `Which movie has a higher rating?`,
    options,
    correctIndex: options.indexOf(higher.title),
  };
}

async function generateQuestions(count: number): Promise<QuizQuestion[]> {
  const trending = await tmdbService.getTrending();
  const topRated = await tmdbService.getTopRated();
  const allMovies = shuffleArray([...trending, ...topRated]);
  const unique = Array.from(new Map(allMovies.map(m => [m.id, m])).values());
  const questions: QuizQuestion[] = [];
  const generators = [generateRatingQuestion, generateYearQuestion];

  for (let i = 0; i < Math.min(count, unique.length); i++) {
    const movie = unique[i];
    if (i % 3 === 2 && i + 1 < unique.length) {
      questions.push(generateHigherRatingQuestion(unique[i], unique[i + 1]));
    } else {
      const gen = generators[i % generators.length];
      questions.push(gen(movie, unique));
    }
  }
  return questions.slice(0, count);
}

export function QuizPage() {
  const [state, setState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const startQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const qs = await generateQuestions(10);
      setQuestions(qs);
      setCurrentQ(0);
      setScore(0);
      setSelected(null);
      setShowAnswer(false);
      setState('playing');
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const selectAnswer = (index: number) => {
    if (showAnswer) return;
    setSelected(index);
    setShowAnswer(true);
    if (index === questions[currentQ].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setState('result');
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (state !== 'playing') return;
      if (showAnswer && (e.key === 'Enter' || e.key === ' ')) {
        nextQuestion();
      }
      if (!showAnswer && ['1', '2', '3', '4'].includes(e.key)) {
        selectAnswer(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const q = questions[currentQ];
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Start Screen */}
          {state === 'start' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-6">
                <span className="text-4xl">🎬</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Movie Trivia</h1>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Test your movie knowledge with 10 questions about ratings, release years, and more!
              </p>
              <button
                onClick={startQuiz}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-white font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Start Quiz 🚀'}
              </button>
            </div>
          )}

          {/* Playing */}
          {state === 'playing' && q && (
            <div>
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-400 text-sm">Question {currentQ + 1}/{questions.length}</span>
                <span className="text-yellow-500 font-semibold">Score: {score}</span>
              </div>
              <div className="w-full h-2 bg-dark-card rounded-full mb-8">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="glass-card p-8 mb-6">
                {q.moviePoster && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={q.moviePoster}
                      alt="Movie"
                      className="w-32 h-48 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold text-white text-center mb-6">{q.question}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((option, i) => {
                    let btnClass = 'glass-card p-4 text-center font-medium transition-all cursor-pointer hover:bg-white/10';
                    if (showAnswer) {
                      if (i === q.correctIndex) {
                        btnClass = 'p-4 text-center font-medium bg-green-500/20 border-2 border-green-500 rounded-xl';
                      } else if (i === selected && i !== q.correctIndex) {
                        btnClass = 'p-4 text-center font-medium bg-red-500/20 border-2 border-red-500 rounded-xl';
                      } else {
                        btnClass = 'glass-card p-4 text-center font-medium opacity-50';
                      }
                    } else if (i === selected) {
                      btnClass = 'p-4 text-center font-medium bg-accent-primary/20 border-2 border-accent-primary rounded-xl';
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => selectAnswer(i)}
                        className={btnClass}
                        disabled={showAnswer}
                      >
                        <span className="text-white">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {showAnswer && (
                <div className="text-center">
                  <p className={`text-lg font-semibold mb-4 ${selected === q.correctIndex ? 'text-green-400' : 'text-red-400'}`}>
                    {selected === q.correctIndex ? '✅ Correct!' : `❌ Wrong! Answer: ${q.options[q.correctIndex]}`}
                  </p>
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-accent-primary rounded-xl text-white font-medium hover:bg-accent-hover transition-colors"
                  >
                    {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {state === 'result' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mb-6">
                <span className="text-5xl">
                  {percentage >= 80 ? '🏆' : percentage >= 50 ? '⭐' : '🎬'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {percentage >= 80 ? 'Movie Expert!' : percentage >= 50 ? 'Nice Job!' : 'Keep Watching!'}
              </h1>
              <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-2">
                {score}/{questions.length}
              </p>
              <p className="text-gray-400 mb-8">{percentage}% correct</p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white font-medium hover:shadow-lg transition-all"
                >
                  Play Again 🔄
                </button>
                <button
                  onClick={() => setState('start')}
                  className="px-6 py-3 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Back to Start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default QuizPage;

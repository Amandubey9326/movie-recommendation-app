/**
 * ChatbotPage - AI Movie Chatbot
 * 
 * Natural language movie assistant that suggests movies
 * based on mood, genre, or similarity to other movies.
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatbotService, type ChatMessage } from '@services/chatbotService';
import { PageTransition } from '@components/common/PageTransition';

const QUICK_PROMPTS = [
  '🔥 What\'s trending?',
  '😊 I\'m feeling happy',
  '🎬 Movies like Inception',
  '💥 Suggest an action movie',
  '⭐ Top rated movies',
  '💕 Date night movie',
];

export function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Welcome message
    const welcome: ChatMessage = {
      id: 'welcome',
      role: 'bot',
      content: "Hey! 🎬 I'm your AI movie buddy. Tell me what you're in the mood for, and I'll find the perfect movie for you!",
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg = chatbotService.createUserMessage(messageText);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const botResponse = await chatbotService.processMessage(messageText);
      setMessages(prev => [...prev, botResponse]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'bot',
        content: 'Oops, something went wrong. Try again!',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-4 px-4 flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Movie Buddy</h1>
            <p className="text-gray-400 text-sm">Ask me anything about movies</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[60vh] scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' 
                  ? 'bg-accent-primary rounded-2xl rounded-br-md px-4 py-3' 
                  : 'glass-card rounded-2xl rounded-bl-md px-4 py-3'}`}
                >
                  <p className="text-white whitespace-pre-line text-sm">{msg.content}</p>
                  
                  {/* Movie cards */}
                  {msg.movies && msg.movies.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {msg.movies.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => navigate(`/movie/${movie.id}`)}
                          className="group text-left"
                        >
                          <div className="aspect-[2/3] rounded-lg overflow-hidden mb-1">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-dark-card flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-300 truncate group-hover:text-white transition-colors">
                            {movie.title}
                          </p>
                          <p className="text-xs text-yellow-500">⭐ {movie.vote_average.toFixed(1)}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="px-3 py-2 text-sm bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about movies..."
              disabled={loading}
              className="w-full pl-4 pr-14 py-4 bg-dark-card border border-dark-border rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent-primary rounded-xl flex items-center justify-center text-white disabled:opacity-30 hover:bg-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ChatbotPage;

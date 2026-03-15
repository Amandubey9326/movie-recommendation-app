/**
 * CastSection Component
 *
 * Display cast and crew information with profile images.
 * Validates: Requirements 7.4
 */

import type { Credits } from '@services/tmdbService';

interface CastSectionProps {
  credits: Credits | null;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

export function CastSection({ credits }: CastSectionProps) {
  if (!credits || !credits.cast.length) return null;

  const topCast = credits.cast.slice(0, 10);
  const director = credits.crew.find(c => c.job === 'Director');

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Cast & Crew</h2>
      
      {director && (
        <p className="text-gray-400 mb-4">
          Directed by <span className="text-white">{director.name}</span>
        </p>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {topCast.map((person) => (
          <div key={person.id} className="flex-shrink-0 w-28 text-center">
            {person.profile_path ? (
              <img
                src={`${TMDB_IMAGE_BASE}${person.profile_path}`}
                alt={person.name}
                className="w-28 h-28 rounded-full object-cover mx-auto mb-2"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-dark-card flex items-center justify-center mx-auto mb-2">
                <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <p className="text-white text-sm font-medium truncate">{person.name}</p>
            <p className="text-gray-400 text-xs truncate">{person.character}</p>
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

export default CastSection;
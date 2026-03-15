/**
 * ProfileSection Component
 *
 * Display user profile information with enhanced styling.
 * Validates: Requirements 10.1
 */

import { useAuth } from '@hooks/useAuth';
import { Link } from 'react-router-dom';

export function ProfileSection() {
  const { user, logout } = useAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const memberSince = 'Movie enthusiast';

  return (
    <div className="glass-card p-6 mb-8 overflow-hidden relative">
      {/* Background gradient decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-xl shadow-accent-primary/20">
              <span className="text-2xl font-bold text-white">
                {getInitials(user?.name || 'User')}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-dark-surface" title="Online" />
          </div>
          
          {/* User Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'Movie Lover'}</h2>
            <p className="text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {user?.email || 'movie@enthusiast.com'}
            </p>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              {memberSince}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link 
            to="/recommendations"
            className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl text-white font-medium hover:shadow-lg hover:shadow-accent-primary/30 transition-all text-center"
          >
            Get Recommendations
          </Link>
          <button
            onClick={logout}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;

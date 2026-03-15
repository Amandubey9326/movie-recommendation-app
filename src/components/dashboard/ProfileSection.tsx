/**
 * ProfileSection Component
 *
 * Display user profile information.
 * Validates: Requirements 10.1
 */

import { useAuth } from '@hooks/useAuth';

export function ProfileSection() {
  const { user } = useAuth();

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
          <span className="text-2xl font-bold text-accent-primary">
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.name || 'User'}</h2>
          <p className="text-gray-400">{user?.email || 'Movie enthusiast'}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
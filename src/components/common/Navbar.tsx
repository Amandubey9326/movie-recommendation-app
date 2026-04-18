/**
 * Navbar Component
 *
 * Fixed navigation bar with:
 * - Links to all pages (Home, Recommendations, Search, Dashboard)
 * - Glassmorphism effect on scroll
 * - Responsive hamburger menu for mobile
 *
 * Validates: Requirements 15.1, 15.2, 13.4
 */

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@hooks/useAuth';

interface NavLink {
  to: string;
  label: string;
}

const navLinks: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/search', label: 'Search' },
  { to: '/mood', label: 'Mood' },
  { to: '/chatbot', label: 'AI Chat' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/dashboard', label: 'Dashboard' },
];

// Custom hook for scroll position
function useScrolled(threshold = 20): boolean {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('scroll', callback, { passive: true });
    return () => window.removeEventListener('scroll', callback);
  }, []);

  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function Navbar() {
  const isScrolled = useScrolled(20);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-surface/80 backdrop-blur-md border-b border-dark-border/50 shadow-lg'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-white font-bold text-xl hover:text-accent-primary transition-colors focus-ring rounded"
            aria-label="MovieRec Home"
          >
            <svg
              className="w-8 h-8 text-accent-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            </svg>
            <span>MovieRec</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-ring ${
                  isActiveLink(link.to)
                    ? 'text-white bg-accent-primary/20 border border-accent-primary/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                aria-current={isActiveLink(link.to) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
            
            {/* User Menu */}
            {user && (
              <div className="relative ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm hidden lg:block">{user.name.split(' ')[0]}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-dark-border">
                      <p className="text-white font-medium truncate">{user.name}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus-ring"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
            <span className="sr-only">
              {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            </span>
            {/* Hamburger icon */}
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-4 py-3 space-y-1 bg-dark-surface/95 backdrop-blur-md border-t border-dark-border/50">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 focus-ring ${
                isActiveLink(link.to)
                  ? 'text-white bg-accent-primary/20 border border-accent-primary/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              aria-current={isActiveLink(link.to) ? 'page' : undefined}
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <>
              <div className="border-t border-dark-border/50 my-2" />
              <div className="px-4 py-2">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-white/10 transition-colors"
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
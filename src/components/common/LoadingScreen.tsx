/**
 * LoadingScreen Component
 *
 * Animated loading screen with logo and 3D rotating element.
 * Validates: Requirements 17.1, 17.2, 17.3
 */

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  isLoading?: boolean;
  minDuration?: number;
}

export function LoadingScreen({ isLoading = true, minDuration = 1000 }: LoadingScreenProps) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShow(false), 500);
      }, minDuration);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-bg transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <svg
          className="w-12 h-12 text-accent-primary"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
        </svg>
        <span className="text-3xl font-bold text-white">MovieRec</span>
      </div>

      {/* 3D Rotating Animation */}
      <div className="relative w-20 h-20 mb-8" style={{ perspective: '200px' }}>
        <div
          className="absolute inset-0 border-4 border-accent-primary rounded-lg"
          style={{
            animation: 'rotate3d 2s linear infinite',
            transformStyle: 'preserve-3d',
          }}
        />
        <div
          className="absolute inset-2 border-4 border-accent-secondary rounded-lg"
          style={{
            animation: 'rotate3d 2s linear infinite reverse',
            animationDelay: '0.5s',
            transformStyle: 'preserve-3d',
          }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-gray-400 text-sm animate-pulse">Loading amazing movies...</p>

      <style>{`
        @keyframes rotate3d {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: rotateX(180deg) rotateY(90deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(180deg);
          }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;

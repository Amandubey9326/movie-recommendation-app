/**
 * InstallPrompt Component
 * 
 * Shows a prompt to install the PWA on mobile devices.
 */

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    
    // Show iOS prompt if not installed
    if (isIOSDevice && !isInStandaloneMode && !dismissed) {
      const timer = setTimeout(() => {
        setIsIOS(true);
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Handle beforeinstallprompt for Android/Chrome
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="glass-card p-4 mx-auto max-w-md border border-accent-primary/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-pink-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Install MovieRec</h3>
            {isIOS ? (
              <p className="text-gray-400 text-sm mb-3">
                Tap <span className="inline-flex items-center"><svg className="w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 24 24"><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .9 2 2z"/></svg></span> then "Add to Home Screen"
              </p>
            ) : (
              <p className="text-gray-400 text-sm mb-3">
                Add to your home screen for quick access and offline support
              </p>
            )}
            <div className="flex gap-2">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-accent-primary rounded-lg text-white text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  Install
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-white/10 rounded-lg text-gray-300 text-sm hover:bg-white/20 transition-colors"
              >
                {isIOS ? 'Got it' : 'Not now'}
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;

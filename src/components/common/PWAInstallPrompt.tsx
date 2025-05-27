'use client';
import { useEffect, useState } from 'react';

function isIos() {
  return (
    typeof window !== 'undefined' &&
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) &&
    !window.navigator.userAgent.toLowerCase().includes('android')
  );
}

function isAndroid() {
  return (
    typeof window !== 'undefined' &&
    /android/.test(window.navigator.userAgent.toLowerCase())
  );
}

const VISIT_KEY = 'pwa_install_prompt_visits';
const DISMISSED_KEY = 'pwa_install_prompt_dismissed';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isANDROID, setIsANDROID] = useState(false);

  useEffect(() => {
    setIsIOS(isIos());
    setIsANDROID(isAndroid());

    // Track visits and dismissed state
    let visits = 1;
    if (typeof window !== 'undefined') {
      visits = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) + 1;
      localStorage.setItem(VISIT_KEY, visits.toString());
    }
    const dismissed = typeof window !== 'undefined' && localStorage.getItem(DISMISSED_KEY) === '1';

    // Only show on first visit or after 3+ visits, and if not dismissed
    const shouldShow = !dismissed && (visits === 1 || visits >= 3);

    if (isIos()) {
      if (shouldShow) setShowPrompt(true);
    } else {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        if (shouldShow) setShowPrompt(true);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setShowPrompt(false);
        if (typeof window !== 'undefined') localStorage.setItem(DISMISSED_KEY, '1');
      });
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    if (typeof window !== 'undefined') localStorage.setItem(DISMISSED_KEY, '1');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[95vw] max-w-md bg-gradient-to-br from-blue-100 to-green-100 border border-blue-300 shadow-2xl rounded-2xl p-4 flex flex-col items-center animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">📱</span>
        <span className="font-bold text-lg text-blue-900">Install Board Master!</span>
      </div>
      <p className="text-center text-gray-700 mb-3 text-sm">
        Add this app to your home screen for easy access anytime.
      </p>
      {isIOS ? (
        <div className="text-center text-gray-800 text-sm mb-2">
          <b>iPhone/iPad:</b> Tap <span className="inline-block px-1"> <svg className="inline w-5 h-5" viewBox="0 0 24 24"><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg> </span> then <b>Add to Home Screen</b> in Safari's share menu.
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="mt-1 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          Add to Home Screen
        </button>
      )}
      <div className="mt-2 text-xs text-gray-500 text-center">
        <span>Quick access, no need to search. You got this! 💪</span>
      </div>
      <button
        className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold bg-transparent border-none"
        onClick={handleClose}
        aria-label="Close install prompt"
      >
        ×
      </button>
    </div>
  );
} 
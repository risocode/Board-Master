"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/common/ThemeContext";
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-4 z-50 ${
      theme === 'dark' ? 'bg-[#23272f] text-white' : 'bg-white text-[#181c24]'
    } shadow-lg border-t border-gray-200 dark:border-gray-700`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm sm:text-base">
            We use cookies to enhance your experience, including personalized ads through Google AdSense. 
            By continuing to use this site, you agree to our use of cookies. 
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={acceptCookies}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
} 
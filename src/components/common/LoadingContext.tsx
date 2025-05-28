"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import Loader from '../Loader';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setFadeOut(false);
    } else if (showLoader) {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        setShowLoader(false);
        setFadeOut(false);
      }, 300); // 300ms fade out
      return () => clearTimeout(timeout);
    }
  }, [isLoading, showLoader]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {showLoader && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300${fadeOut ? ' opacity-0' : ' opacity-100'}`}
          style={{ pointerEvents: 'none', userSelect: 'none', willChange: 'opacity, transform' }}
          data-fadeout={fadeOut ? 'true' : 'false'}
        >
          <Loader loading={isLoading && !fadeOut} />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoadingState() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoadingState must be used within a LoadingProvider');
  }
  return context;
} 
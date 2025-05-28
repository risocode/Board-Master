"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoadingState } from '@/components/common/LoadingContext';

export function useNavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsLoading } = useLoadingState();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams, setIsLoading]);
} 
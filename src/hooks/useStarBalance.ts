import { useEffect, useState, useCallback, useRef } from 'react';
import { getUserInfo, type UserInfo } from '@/lib/api';

const MIN_REFRESH_INTERVAL = 5000; // 5 seconds minimum between refreshes

export function useStarBalance() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRefreshTime = useRef(0); // Use ref instead of state to prevent re-renders
  const refreshPromise = useRef<Promise<void> | null>(null); // Track ongoing refresh

  const refreshBalance = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastRefreshTime.current < MIN_REFRESH_INTERVAL) {
      return; // Skip if too soon and not forced
    }

    // If there's an ongoing refresh, wait for it
    if (refreshPromise.current) {
      return refreshPromise.current;
    }

    // Start new refresh
    try {
      setIsLoading(true);
      setError(null);
      
      // Create and store the promise
      refreshPromise.current = (async () => {
        try {
          const info = await getUserInfo();
          setUserInfo(info);
          lastRefreshTime.current = Date.now();
        } finally {
          refreshPromise.current = null; // Clear the promise reference
        }
      })();

      await refreshPromise.current;
    } catch (err) {
      console.error('Failed to load user info:', err);
      setError('Failed to load user information');
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed since we use refs

  // Initial load
  useEffect(() => {
    refreshBalance(true);
  }, []); // Only run on mount

  return {
    userInfo,
    isLoading,
    error,
    refreshBalance
  };
}
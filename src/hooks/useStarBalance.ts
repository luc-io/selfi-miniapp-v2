import { useEffect, useState, useCallback } from 'react';
import { getUserInfo, type UserInfo } from '@/lib/api';

export function useStarBalance() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(0); // Add timestamp tracking

  const refreshBalance = useCallback(async (force = false) => {
    // Add minimum refresh interval (5 seconds)
    const now = Date.now();
    if (!force && now - lastRefreshTime < 5000) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const info = await getUserInfo();
      console.log('Star balance refreshed:', info.stars);
      setUserInfo(info);
      setLastRefreshTime(now);
    } catch (err) {
      console.error('Failed to load user info:', err);
      setError('Failed to load user information');
    } finally {
      setIsLoading(false);
    }
  }, [lastRefreshTime]);

  // Initial load
  useEffect(() => {
    refreshBalance(true);
  }, [refreshBalance]);

  return {
    userInfo,
    isLoading,
    error,
    refreshBalance: () => refreshBalance(true) // Force refresh when explicitly called
  };
}

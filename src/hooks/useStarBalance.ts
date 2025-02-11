import { useEffect, useState, useCallback } from 'react';
import { getUserInfo, type UserInfo } from '@/lib/api';

export function useStarBalance() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (err) {
      console.error('Failed to load user info:', err);
      setError('Failed to load user information');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return {
    userInfo,
    isLoading,
    error,
    refreshBalance
  };
}

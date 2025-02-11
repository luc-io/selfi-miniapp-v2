import { useEffect, useRef } from 'react';

const REFRESH_INTERVAL = 30000; // 30 seconds
const MIN_REFRESH_INTERVAL = 5000; // Minimum 5 seconds between refreshes

export function useBalanceRefresh(onRefresh: () => void) {
  const lastRefreshTime = useRef<number>(0);

  // Throttled refresh function
  const throttledRefresh = () => {
    const now = Date.now();
    if (now - lastRefreshTime.current >= MIN_REFRESH_INTERVAL) {
      onRefresh();
      lastRefreshTime.current = now;
    }
  };

  useEffect(() => {
    // Initial refresh
    throttledRefresh();

    // Set up polling interval
    const interval = setInterval(throttledRefresh, REFRESH_INTERVAL);

    // Set up visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        throttledRefresh();
      }
    };

    // Set up Telegram background event listener
    const handleTelegramEvent = () => {
      if (window.Telegram?.WebApp?.isExpanded) {
        throttledRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.Telegram?.WebApp?.onEvent('viewportChanged', handleTelegramEvent);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.Telegram?.WebApp?.offEvent('viewportChanged', handleTelegramEvent);
    };
  }, [onRefresh]); // onRefresh is a dependency because throttledRefresh uses it
}
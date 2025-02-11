import { useEffect } from 'react';

const REFRESH_INTERVAL = 10000; // 10 seconds

export function useBalanceRefresh(onRefresh: () => void) {
  useEffect(() => {
    // Set up polling interval
    const interval = setInterval(onRefresh, REFRESH_INTERVAL);

    // Set up visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onRefresh();
      }
    };

    // Set up Telegram background event listener
    const handleTelegramEvent = () => {
      if (window.Telegram?.WebApp?.isExpanded) {
        onRefresh();
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
  }, [onRefresh]);
}

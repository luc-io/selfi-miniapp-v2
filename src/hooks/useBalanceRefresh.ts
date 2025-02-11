import { useEffect } from 'react';

const REFRESH_INTERVAL = 60000; // Refresh only every minute by default
const ONLY_ON_FOCUS = true; // Don't poll in background

export function useBalanceRefresh(onRefresh: () => void) {
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When becoming visible, do a refresh and restart polling
        onRefresh();
        if (!interval) {
          interval = setInterval(onRefresh, REFRESH_INTERVAL);
        }
      } else if (ONLY_ON_FOCUS && interval) {
        // When hidden, stop polling if ONLY_ON_FOCUS is true
        clearInterval(interval);
        interval = undefined;
      }
    };

    // Handle Telegram events
    const handleTelegramEvent = () => {
      if (window.Telegram?.WebApp?.isExpanded) {
        onRefresh();
      }
    };

    // Initial setup
    if (document.visibilityState === 'visible') {
      onRefresh();
      if (!ONLY_ON_FOCUS || document.visibilityState === 'visible') {
        interval = setInterval(onRefresh, REFRESH_INTERVAL);
      }
    }

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.Telegram?.WebApp?.onEvent('viewportChanged', handleTelegramEvent);

    // Cleanup
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.Telegram?.WebApp?.offEvent('viewportChanged', handleTelegramEvent);
    };
  }, [onRefresh]);
}
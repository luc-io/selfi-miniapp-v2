import { useEffect, useState } from 'react';
import { TelegramUser } from '../types/telegram';

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!window.Telegram?.WebApp) return;

    const webApp = window.Telegram.WebApp;
    setUser(webApp.initDataUnsafe.user || null);
    setIsReady(true);
  }, []);

  return {
    user,
    isReady,
    webApp: window.Telegram?.WebApp,
  };
}
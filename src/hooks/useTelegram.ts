import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user: TelegramUser;
    start_param?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  expand: () => void;
  close: () => void;
  ready: () => void;
  MainButton: {
    text: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      console.error('Telegram WebApp is not available');
      return;
    }

    // Get user data
    const userData = webApp.initDataUnsafe.user;
    setUser(userData);

    // Initialize app
    webApp.ready();
    setIsReady(true);

    // Expand webview
    if (!webApp.isExpanded) {
      webApp.expand();
    }
  }, []);

  return {
    user,
    isReady,
    webApp: window.Telegram?.WebApp
  };
}

export function useMainButton(text: string, onClick: () => void) {
  const { webApp } = useTelegram();

  useEffect(() => {
    if (!webApp?.MainButton) return;

    const button = webApp.MainButton;
    button.text = text;
    button.onClick(onClick);
    button.show();

    return () => {
      button.offClick(onClick);
      button.hide();
    };
  }, [webApp, text, onClick]);

  return {
    show: () => webApp?.MainButton.show(),
    hide: () => webApp?.MainButton.hide(),
    enable: () => webApp?.MainButton.enable(),
    disable: () => webApp?.MainButton.disable()
  };
}
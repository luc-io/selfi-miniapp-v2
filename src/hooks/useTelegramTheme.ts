import { useEffect, useState } from 'react';
import type { TelegramThemeParams } from '@/types/telegram';

const defaultTheme: TelegramThemeParams = {
  bg_color: '#ffffff',
  text_color: '#000000',
  hint_color: '#999999',
  link_color: '#3390ec',
  button_color: '#3390ec',
  button_text_color: '#ffffff',
  secondary_bg_color: '#f4f4f5',
};

export function useTelegramTheme() {
  const [themeParams, setThemeParams] = useState<TelegramThemeParams>(defaultTheme);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      // Set initial theme
      setThemeParams(webApp.themeParams);
      
      // Setup theme change listener
      const handleThemeChange = () => {
        setThemeParams(webApp.themeParams);
      };

      webApp.onEvent('themeChanged', handleThemeChange);

      // Cleanup
      return () => {
        webApp.offEvent('themeChanged', handleThemeChange);
      };
    }
  }, []);

  return themeParams;
}
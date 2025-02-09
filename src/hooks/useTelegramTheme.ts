import { useEffect, useState } from 'react';

interface ThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color: string;
  link_color?: string;
}

export function useTelegramTheme() {
  const [themeParams, setThemeParams] = useState<ThemeParams>({
    bg_color: '#ffffff',
    text_color: '#000000',
    hint_color: '#999999',
    button_color: '#3390ec',
    button_text_color: '#ffffff',
    secondary_bg_color: '#f4f4f5',
  });

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      setThemeParams(webApp.themeParams);
      
      // Listen for theme changes
      webApp.onEvent('themeChanged', () => {
        setThemeParams(webApp.themeParams);
      });
    }
  }, []);

  return themeParams;
}
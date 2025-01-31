import { TelegramWebApp } from '@/types/telegram';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
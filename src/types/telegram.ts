export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: TelegramUser;
          auth_date?: string;
          hash?: string;
        };
        close: () => void;
        sendData: (data: string) => void;
      };
    };
  }
}
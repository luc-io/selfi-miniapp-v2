export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramPopup {
  title?: string;
  message: string;
  buttons?: Array<{
    id?: string;
    type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text?: string;
  }>;
}

export interface TelegramWebApp {
  ready(): void;
  close(): void;
  sendData(data: string): void;
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
  };
  showPopup(params: TelegramPopup): Promise<string | void>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
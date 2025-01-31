interface TelegramPopup {
  title?: string;
  message: string;
  buttons?: Array<{
    id?: string;
    type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text?: string;
  }>;
}

interface TelegramWebApp {
  ready(): void;
  close(): void;
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
    };
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
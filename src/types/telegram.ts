export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface PopupParams {
  title?: string;
  message: string;
  buttons?: Array<{
    id: string;
    type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text: string;
  }>;
}

interface WebApp {
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date?: string;
    hash?: string;
  };
  close: () => void;
  sendData: (data: string) => void;
  showPopup: (params: PopupParams) => Promise<string>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebApp;
    };
  }
}
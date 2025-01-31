export interface Model {
  id: string;
  name: string;
  type: 'public' | 'private' | 'trained';
}

export interface ModelResponse {
  success: boolean;
  model?: Model;
  error?: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface Generation {
  id: string;
  status: 'pending' | 'success' | 'error';
  model: Model;
  params: Record<string, any>;
  result?: {
    url: string;
  };
  error?: string;
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

// Declare Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready(): void;
        close(): void;
        initData: string;
        initDataUnsafe: {
          user?: TelegramUser;
        };
        showPopup(params: TelegramPopup): Promise<string | void>;
      };
    };
  }
}
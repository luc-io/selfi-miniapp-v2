interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  viewportHeight: number;
  viewportStableHeight: number;
  expand: () => void;
  close: () => void;
  ready: () => void;
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (fn: () => void) => void;
    offClick: (fn: () => void) => void;
  };
  showAlert: (message: string) => void;
  showPopup: (params: { title: string; message: string }) => void;
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
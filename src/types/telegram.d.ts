interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebAppInitData {
  user: TelegramWebAppUser;
  [key: string]: any;
}

interface TelegramWebApp {
  initDataUnsafe: TelegramWebAppInitData;
  ready(): void;
  showPopup(params: { message: string }): void;
  MainButton: {
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  [key: string]: any;
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
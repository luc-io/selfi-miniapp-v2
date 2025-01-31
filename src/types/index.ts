export interface Model {
  id: string;
  name: string;
  triggerWord: string;
  previewImageUrl?: string;
  starsRequired: number;
  isPublic: boolean;
}

export interface Generation {
  id: string;
  prompt: string;
  negativePrompt?: string;
  imageUrl: string;
  seed?: number;
  starsUsed: number;
  createdAt: string;
  model?: Model;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  expand: () => void;
  close: () => void;
  ready: () => void;
  MainButton: {
    text: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    setText: (text: string) => void;
    onClick: (fn: () => void) => void;
    offClick: (fn: () => void) => void;
  };
  showAlert: (message: string) => void;
  showPopup: (params: { title: string; message: string }) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
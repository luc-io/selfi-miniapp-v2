interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user: TelegramUser;
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
export interface TelegramThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color: string;
}

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface InitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  start_param?: string;
  auth_date?: number;
  hash?: string;
}

interface PopupParams {
  message: string;
  title?: string;
  buttons?: Array<{
    id: string;
    type: 'default' | 'ok' | 'close' | 'cancel';
    text: string;
  }>;
}

export interface TelegramWebApp {
  initDataUnsafe: InitData;
  initData: string;
  colorScheme: 'light' | 'dark';
  themeParams: TelegramThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  onEvent(eventType: 'themeChanged' | 'viewportChanged' | 'mainButtonClicked', eventHandler: () => void): void;
  offEvent(eventType: 'themeChanged' | 'viewportChanged' | 'mainButtonClicked', eventHandler: () => void): void;
  sendData(data: string): void;
  ready(): void;
  expand(): void;
  close(): void;
  showPopup(params: PopupParams): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
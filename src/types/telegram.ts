export interface TelegramThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color: string;
}

export interface TelegramWebApp {
  themeParams: TelegramThemeParams;
  colorScheme: 'light' | 'dark';
  onEvent(eventType: 'themeChanged' | 'viewportChanged' | 'mainButtonClicked', eventHandler: () => void): void;
  offEvent(eventType: 'themeChanged' | 'viewportChanged' | 'mainButtonClicked', eventHandler: () => void): void;
  sendData(data: string): void;
  close(): void;
  ready(): void;
  expand(): void;
  showPopup(params: { message: string; buttons?: Array<{ id: string; type: 'default' | 'ok' | 'close' | 'cancel'; text: string; }> }): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
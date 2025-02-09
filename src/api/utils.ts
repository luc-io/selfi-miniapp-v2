type Headers = Record<string, string>;

export function buildHeaders(): Headers {
  const headers: Headers = {
    'X-Telegram-User-Id': window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '',
  };

  if (window.Telegram?.WebApp?.initData) {
    headers['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData;
  }

  return headers;
}
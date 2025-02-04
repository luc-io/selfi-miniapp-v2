import type { TelegramUser } from '../types/telegram';

const API_URL = import.meta.env.VITE_API_URL;

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function getInitData(): string {
  const searchParams = new URLSearchParams(window.location.hash.slice(1));
  return searchParams.get('tgWebAppData') || '';
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  user?: TelegramUser
): Promise<T> {
  const initData = getInitData();

  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': user?.id.toString() || '',
    'x-telegram-init-data': initData,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new APIError(
      response.status,
      error.error || 'API request failed'
    );
  }

  return response.json();
}
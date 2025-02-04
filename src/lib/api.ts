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
  user?: TelegramUser | null
): Promise<T> {
  if (!user?.id) {
    throw new APIError(401, 'No user ID found');
  }

  const initData = getInitData();
  const headers = {
    'Content-Type': 'application/json',
    'x-telegram-user-id': user.id.toString(),
    'x-telegram-init-data': initData,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new APIError(
        response.status,
        errorData.error || response.statusText || 'API request failed'
      );
    } catch (e) {
      if (e instanceof APIError) throw e;
      throw new APIError(
        response.status,
        response.statusText || 'API request failed'
      );
    }
  }

  const data = await response.json();
  if (data.error) {
    throw new APIError(
      response.status,
      data.error
    );
  }

  return data;
}
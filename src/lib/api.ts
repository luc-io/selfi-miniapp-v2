import type { TelegramUser } from '../types/telegram';

const API_URL = import.meta.env.VITE_API_URL;

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  user?: TelegramUser
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': user?.id.toString() || '',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new APIError(
      response.status,
      response.statusText || 'API request failed'
    );
  }

  return response.json();
}

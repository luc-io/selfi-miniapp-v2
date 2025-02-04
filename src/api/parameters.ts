import { WebApp } from '@twa-dev/types';
import { GenerationParameters } from '@/types';
import { apiRequest } from '../lib/api';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}

export interface UserParametersResponse {
  params: GenerationParameters;
}

export async function getUserParameters(): Promise<UserParametersResponse | null> {
  const user = window.Telegram.WebApp.initDataUnsafe.user;
  if (!user?.id) return null;

  try {
    return await apiRequest<UserParametersResponse>(`/api/params/${user.id}`, {}, user);
  } catch (error) {
    console.error('Error fetching user parameters:', error);
    return null;
  }
}

export async function saveUserParameters(params: GenerationParameters): Promise<UserParametersResponse> {
  const user = window.Telegram.WebApp.initDataUnsafe.user;
  if (!user?.id) throw new Error('No user ID found');

  return await apiRequest<UserParametersResponse>('/api/params', {
    method: 'POST',
    body: JSON.stringify({ params })
  }, user);
}
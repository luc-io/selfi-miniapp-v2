import { WebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}

interface UserParameters {
  params: {
    image_size?: string;
    num_inference_steps?: number;
    seed?: number;
    guidance_scale?: number;
    num_images?: number;
    sync_mode?: boolean;
    enable_safety_checker?: boolean;
    output_format?: string;
  };
}

export async function getUserParameters(): Promise<UserParameters | null> {
  const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id;
  if (!telegramId) return null;

  try {
    const response = await fetch(`/api/user-parameters/${telegramId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to get user parameters: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user parameters:', error);
    return null;
  }
}

export async function saveUserParameters(params: UserParameters['params']): Promise<UserParameters> {
  const telegramId = window.Telegram.WebApp.initDataUnsafe.user?.id;
  if (!telegramId) throw new Error('No user ID found');

  const response = await fetch(`/api/user-parameters/${telegramId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save parameters');
  }

  return response.json();
}
import { apiRequest } from '../lib/api';
import type { TelegramUser } from '@/types/telegram';
import type { Model } from '@/types';

export interface Params {
  image_size?: string;
  num_inference_steps?: number;
  seed?: number;
  guidance_scale?: number;
  num_images?: number;
  sync_mode?: boolean;
  enable_safety_checker?: boolean;
  output_format?: string;
  model?: Model;
}

export interface UserParameters {
  params: Params;
}

function getTelegramUser(): TelegramUser | undefined {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
}

export async function getUserParameters(): Promise<UserParameters | null> {
  const user = getTelegramUser();
  if (!user?.id) return null;

  try {
    return await apiRequest<UserParameters>(`/api/params/${user.id}`, {}, user);
  } catch (error) {
    console.error('Error fetching user parameters:', error);
    return null;
  }
}

export async function saveUserParameters(params: Params): Promise<UserParameters> {
  const user = getTelegramUser();
  if (!user?.id) throw new Error('No user ID found');

  return await apiRequest<UserParameters>('/api/params', {
    method: 'POST',
    body: JSON.stringify({ params })
  }, user);
}
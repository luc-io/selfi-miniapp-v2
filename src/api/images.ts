import type { GeneratedImage } from '@/types/image';
import { buildValidationData } from './loras';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export interface ImagesResponse {
  images: GeneratedImage[];
  total: number;
  hasMore: boolean;
}

export interface GetImagesParams {
  page?: number;
  limit?: number;
}

export async function getGeneratedImages(params: GetImagesParams = {}): Promise<ImagesResponse> {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) throw new Error('Telegram WebApp not available');
  const userId = webApp.initDataUnsafe?.user?.id?.toString();
  if (!userId) throw new Error('Telegram user ID not available');

  const { page = 1, limit = 10 } = params;
  
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  const response = await fetch(`${API_BASE}/images?${searchParams.toString()}`, {
    headers: {
      'x-telegram-init-data': buildValidationData(webApp),
      'x-telegram-user-id': userId,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch generated images');
  }

  return response.json();
}

export async function getImageById(id: string): Promise<GeneratedImage> {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) throw new Error('Telegram WebApp not available');
  const userId = webApp.initDataUnsafe?.user?.id?.toString();
  if (!userId) throw new Error('Telegram user ID not available');

  const response = await fetch(`${API_BASE}/images/${id}`, {
    headers: {
      'x-telegram-init-data': buildValidationData(webApp),
      'x-telegram-user-id': userId,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch image details');
  }

  return response.json();
}
import { API_BASE_URL } from '@/config';
import { getValidToken } from '@/utils/telegram';
import type { GeneratedImage } from '@/types/image';

export type ImageData = GeneratedImage;

export interface ImagesResponse {
  images: ImageData[];
  hasMore: boolean;
  total: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

export async function getGeneratedImages(params: PaginationParams = {}): Promise<ImagesResponse> {
  const token = await getValidToken();
  
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/api/images?${searchParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': token
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Convert string seed to number if necessary
  const images = data.images.map((img: any) => ({
    ...img,
    seed: typeof img.seed === 'string' ? parseInt(img.seed, 10) : img.seed
  }));

  return {
    ...data,
    images
  };
}

export async function deleteImage(imageId: string): Promise<void> {
  const token = await getValidToken();
  
  const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': token
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText || 'Failed to delete image');
  }
}
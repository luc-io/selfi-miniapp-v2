import { API_BASE_URL } from '@/config';
import { getValidToken } from '@/utils/telegram';

export interface ImageData {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  width: number;
  height: number;
  seed: string;
  hasNsfw: boolean;
  params: {
    image_size: string;
    num_inference_steps: number;
    guidance_scale: number;
    enable_safety_checker: boolean;
    output_format: 'jpeg' | 'png';
    originalSeed: number;
    requestedSeed: number;
    loras?: Array<{
      id: string;
      name: string;
      triggerWord: string;
      scale: number;
      weightsUrl: string;
    }>;
  };
}

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

  return response.json();
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
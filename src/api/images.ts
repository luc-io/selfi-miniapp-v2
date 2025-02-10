import { apiRequest } from '../lib/api';
import type { GeneratedImage } from '@/types/image';

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
  const { page = 1, limit = 20 } = params;
  
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  return apiRequest<ImagesResponse>(`/api/images?${searchParams.toString()}`);
}

export async function getImageById(id: string): Promise<GeneratedImage> {
  return apiRequest<GeneratedImage>(`/api/images/${id}`);
}
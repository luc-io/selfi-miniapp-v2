import { apiRequest } from '../api';
import type { Model } from '@/types/model';

// Get user's models
export async function getUserModels(): Promise<Model[]> {
  return apiRequest<Model[]>('/api/loras/user');
}
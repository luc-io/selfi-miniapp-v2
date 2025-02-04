import { Parameters, UserParametersResponse } from '@/types';
import { apiRequest } from '../lib/api';

export async function getUserParameters(): Promise<UserParametersResponse | null> {
  const user = window.Telegram?.WebApp?.initDataUnsafe.user;
  if (!user?.id) return null;

  try {
    return await apiRequest<UserParametersResponse>(`/api/params/${user.id}`, {}, user);
  } catch (error) {
    console.error('Error fetching user parameters:', error);
    return null;
  }
}

interface SaveParametersRequest {
  model?: {
    modelPath: string;
  };
  params: Parameters;
}

export async function saveUserParameters(params: Parameters): Promise<UserParametersResponse> {
  const user = window.Telegram?.WebApp?.initDataUnsafe.user;
  if (!user?.id) throw new Error('No user ID found');

  const requestData: SaveParametersRequest = {
    params: {
      image_size: params.image_size,
      num_inference_steps: params.num_inference_steps,
      seed: params.seed,
      guidance_scale: params.guidance_scale,
      num_images: params.num_images,
      sync_mode: params.sync_mode,
      enable_safety_checker: params.enable_safety_checker,
      output_format: params.output_format
    }
  };

  return await apiRequest<UserParametersResponse>('/api/params', {
    method: 'POST',
    body: JSON.stringify(requestData)
  }, user);
}
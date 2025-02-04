import { GenerationParameters } from '@/types';
import { apiRequest } from '../lib/api';

export interface UserParametersResponse {
  params: GenerationParameters;
}

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

export async function saveUserParameters(params: GenerationParameters): Promise<UserParametersResponse> {
  const user = window.Telegram?.WebApp?.initDataUnsafe.user;
  if (!user?.id) throw new Error('No user ID found');

  // Extract model info
  const { modelPath, ...otherParams } = params;
  
  const requestData = {
    model: {
      modelPath
    },
    params: otherParams
  };

  return await apiRequest<UserParametersResponse>('/api/params', {
    method: 'POST',
    body: JSON.stringify(requestData)
  }, user);
}
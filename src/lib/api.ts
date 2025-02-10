import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface UserInfo {
  username: string;
  stars: number;
  telegramId: string;
}

export interface TrainingProgress {
  trainingId: string;
  loraId: string;
  status: string;
  progress: number;
  message?: string;
  error?: string;
  estimatedTimeRemaining?: number;
  metadata?: any;
  completedAt?: string;
  test_mode?: boolean;
}

export interface TrainingResponse {
  trainingId: string;
  loraId: string;
  test_mode?: boolean;
}

// Helper function to get the Telegram WebApp user's ID from window object
const getTelegramUserId = (): string | null => {
  try {
    return window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || null;
  } catch (error) {
    console.error('Failed to get Telegram user ID:', error);
    return null;
  }
};

// Generic API request helper
export const apiRequest = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  const userId = getTelegramUserId();
  if (!userId) {
    throw new Error('User ID not found');
  }

  const response = await axios({
    ...options,
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      ...options.headers,
      'x-telegram-user-id': userId
    }
  });

  return response.data;
};

export const getUserInfo = async (): Promise<UserInfo> => {
  return apiRequest('/users/me');
};

export const startTraining = async (
  params: {
    steps: number;
    isStyle: boolean;
    createMasks: boolean;
    triggerWord: string;
  },
  files: File[],
  captions: Record<string, string>
): Promise<TrainingResponse> => {
  const formData = new FormData();
  
  // Add files
  files.forEach(file => {
    formData.append('files', file);
  });

  // Add parameters
  formData.append('params', JSON.stringify({
    steps: params.steps,
    is_style: params.isStyle,
    create_masks: params.createMasks,
    trigger_word: params.triggerWord,
    captions
  }));

  return apiRequest('/training/start', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getTrainingStatus = async (trainingId: string): Promise<TrainingProgress> => {
  return apiRequest(`/training/${trainingId}/status`);
};

export const cancelTraining = async (trainingId: string): Promise<{ message: string }> => {
  return apiRequest(`/training/${trainingId}/cancel`, {
    method: 'POST'
  });
};
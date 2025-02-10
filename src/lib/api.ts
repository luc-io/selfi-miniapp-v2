import axios from 'axios';

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

export const getUserInfo = async (): Promise<UserInfo> => {
  const userId = getTelegramUserId();
  if (!userId) {
    throw new Error('User ID not found');
  }

  const response = await axios.get(`${API_BASE_URL}/users/me`, {
    headers: {
      'x-telegram-user-id': userId
    }
  });

  return response.data;
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
  const userId = getTelegramUserId();
  if (!userId) {
    throw new Error('User ID not found');
  }

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

  const response = await axios.post(`${API_BASE_URL}/training/start`, formData, {
    headers: {
      'x-telegram-user-id': userId,
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const getTrainingStatus = async (trainingId: string): Promise<TrainingProgress> => {
  const userId = getTelegramUserId();
  if (!userId) {
    throw new Error('User ID not found');
  }

  const response = await axios.get(`${API_BASE_URL}/training/${trainingId}/status`, {
    headers: {
      'x-telegram-user-id': userId
    }
  });

  return response.data;
};

export const cancelTraining = async (trainingId: string): Promise<{ message: string }> => {
  const userId = getTelegramUserId();
  if (!userId) {
    throw new Error('User ID not found');
  }

  const response = await axios.post(`${API_BASE_URL}/training/${trainingId}/cancel`, null, {
    headers: {
      'x-telegram-user-id': userId
    }
  });

  return response.data;
};
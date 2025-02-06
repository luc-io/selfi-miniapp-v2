// Training Types
export interface TrainingProgress {
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';
  message?: string;
  error?: string;
  metadata?: any;
}

export interface TrainingParams {
  steps: number;
  isStyle: boolean;
  createMasks: boolean;
  triggerWord: string;
  images_data_url: string;
}

export interface TrainingResponse {
  id: string;
  trainingId: string;
}

export interface UploadResponse {
  images_data_url: string;
}

// Training API Functions
export async function uploadTrainingFiles(formData: FormData): Promise<UploadResponse> {
  const response = await fetch('/api/training/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'x-telegram-user-id': String(window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '')
    }
  });

  if (!response.ok) {
    throw new Error('Failed to upload files');
  }

  return response.json();
}

export async function startTraining(params: TrainingParams): Promise<TrainingResponse> {
  const response = await fetch('/api/training/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-user-id': String(window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '')
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error('Failed to start training');
  }

  return response.json();
}

export async function getTrainingProgress(id: string | null): Promise<TrainingProgress | null> {
  if (!id) return null;

  const response = await fetch(`/api/training/${id}/status`, {
    headers: {
      'x-telegram-user-id': String(window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '')
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get training status');
  }

  return response.json();
}
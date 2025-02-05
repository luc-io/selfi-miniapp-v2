interface TrainingParams {
  steps: number;
  isStyle: boolean;
  createMasks: boolean;
  triggerWord: string;
  images: File[];
  captions: Record<string, string>;
}

interface TrainingResult {
  requestId: string;
  loraUrl: string;
  configUrl: string;
}

interface TrainingProgress {
  status: 'pending' | 'training' | 'completed' | 'failed';
  progress: number;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function startTraining(params: TrainingParams): Promise<string> {
  const formData = new FormData();
  
  // Add each image to form data
  params.images.forEach((image, index) => {
    formData.append(`images`, image);
  });

  // Add captions as JSON
  formData.append('captions', JSON.stringify(params.captions));
  
  // Add other parameters
  formData.append('steps', params.steps.toString());
  formData.append('isStyle', params.isStyle.toString());
  formData.append('createMasks', params.createMasks.toString());
  formData.append('triggerWord', params.triggerWord);

  const response = await fetch(`${API_BASE_URL}/training/start`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to start training');
  }

  const data = await response.json();
  return data.requestId;
}

export async function getTrainingProgress(requestId: string): Promise<TrainingProgress> {
  const response = await fetch(`${API_BASE_URL}/training/${requestId}/progress`);

  if (!response.ok) {
    throw new Error('Failed to get training progress');
  }

  return response.json();
}

export async function getTrainingResult(requestId: string): Promise<TrainingResult> {
  const response = await fetch(`${API_BASE_URL}/training/${requestId}/result`);

  if (!response.ok) {
    throw new Error('Failed to get training result');
  }

  return response.json();
}
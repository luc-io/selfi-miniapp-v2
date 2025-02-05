const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...headers,
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

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

export async function startTraining(params: TrainingParams): Promise<string> {
  const formData = new FormData();
  
  // Add each image to form data
  params.images.forEach((image) => {
    formData.append('images', image);
  });

  // Add captions as JSON
  formData.append('captions', JSON.stringify(params.captions));
  
  // Add other parameters
  formData.append('steps', params.steps.toString());
  formData.append('isStyle', params.isStyle.toString());
  formData.append('createMasks', params.createMasks.toString());
  formData.append('triggerWord', params.triggerWord);

  const result = await apiRequest<{ requestId: string }>('/training/start', {
    method: 'POST',
    body: formData,
  });

  return result.requestId;
}

export async function getTrainingProgress(requestId: string | null): Promise<TrainingProgress | null> {  
  if (!requestId) return null;
  
  return apiRequest<TrainingProgress>(`/training/${requestId}/progress`);
}

export async function getTrainingResult(requestId: string): Promise<TrainingResult> {
  return apiRequest<TrainingResult>(`/training/${requestId}/result`);
}
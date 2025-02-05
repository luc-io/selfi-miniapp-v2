const API_BASE_URL = import.meta.env.VITE_API_URL;

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;
  const user = window.Telegram?.WebApp?.initDataUnsafe.user as TelegramUser | undefined;

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    ...headers,
    ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
  };

  // Add auth headers if user exists
  if (user) {
    requestHeaders['X-Telegram-User-Id'] = user.id.toString();
    requestHeaders['X-Telegram-Username'] = user.username || '';
    requestHeaders['X-Telegram-First-Name'] = user.first_name;
    requestHeaders['X-Telegram-Last-Name'] = user.last_name || '';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    credentials: 'include',
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Training Types
export interface TrainingParams {
  steps: number;
  isStyle: boolean;
  createMasks: boolean;
  triggerWord: string;
  images: File[];
  captions: Record<string, string>;
}

export interface TrainingResult {
  requestId: string;
  loraUrl: string;
  configUrl: string;
}

export interface TrainingProgress {
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
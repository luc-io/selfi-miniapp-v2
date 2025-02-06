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
  images_data_url: string;
}

export interface TrainingResult {
  id: string;
  trainingId: string;
}

export interface TrainingProgress {
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';
  message?: string;
}

export async function uploadTrainingFiles(formData: FormData) {
  return apiRequest<{ images_data_url: string }>('/api/training/upload', {
    method: 'POST',
    body: formData
  });
}

export async function startTraining(params: TrainingParams): Promise<TrainingResult> {
  return apiRequest<TrainingResult>('/api/training/start', {
    method: 'POST',
    body: params
  });
}

export async function getTrainingProgress(id: string | null): Promise<TrainingProgress | null> {  
  if (!id) return null;
  return apiRequest<TrainingProgress>(`/api/training/${id}/status`);
}
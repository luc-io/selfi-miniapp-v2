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

  // Log request details
  console.log(`API Request to ${path}:`, {
    method,
    headers,
    bodyType: body instanceof FormData ? 'FormData' : typeof body,
    bodySize: body instanceof FormData ? 
      Array.from(body.entries()).reduce((size, [_, value]) => {
        if (value instanceof File) return size + value.size;
        return size + new Blob([String(value)]).size;
      }, 0) : 
      body ? new Blob([JSON.stringify(body)]).size : 0,
    user
  });

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

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      credentials: 'include',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    // Log response status
    console.log(`API Response from ${path}:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.statusText}`;
      let errorDetails = {};

      try {
        // Try to parse error response
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorDetails = errorData;
      } catch (e) {
        // If error response is not JSON, try to get text
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (e2) {
          // If we can't get text, use original error message
        }
      }

      console.error('API Error Details:', {
        path,
        status: response.status,
        message: errorMessage,
        details: errorDetails
      });

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`API Success from ${path}:`, data);
    return data;
  } catch (error) {
    console.error('API Request Failed:', {
      path,
      error,
      body: body instanceof FormData ? 'FormData content' : body
    });
    throw error;
  }
}

// User Types
export interface UserInfo {
  stars: number;
  totalSpentStars: number;
  totalBoughtStars: number;
}

export async function getUserInfo(): Promise<UserInfo> {
  return apiRequest<UserInfo>('/api/user/info');
}

// Training Types
export interface TrainingParams {
  steps: number;
  isStyle: boolean;
  createMasks: boolean;
  triggerWord: string;
}

export interface TrainingResult {
  trainingId: string;
  loraId: string;
  test_mode?: boolean;
}

export interface TrainingProgress {
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';
  message?: string;
}

export async function startTraining(
  params: TrainingParams, 
  files: File[],
  captions: Record<string, string>
): Promise<TrainingResult> {
  // Create FormData with files and parameters
  const formData = new FormData();

  // Add parameters
  formData.append('params', JSON.stringify({
    steps: params.steps,
    is_style: params.isStyle,
    create_masks: params.createMasks,
    trigger_word: params.triggerWord,
    captions
  }));

  // Add files
  files.forEach(file => {
    formData.append('images', file);
  });

  // Let's check the total size before sending
  const totalSize = Array.from(formData.entries()).reduce((size, [_, value]) => {
    if (value instanceof File) return size + value.size;
    return size + new Blob([String(value)]).size;
  }, 0);

  console.log('Total upload size:', {
    bytes: totalSize,
    mb: (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
  });

  return apiRequest<TrainingResult>('/api/training/start', {
    method: 'POST',
    body: formData
  });
}

export async function getTrainingProgress(id: string | null): Promise<TrainingProgress | null> {  
  if (!id) return null;
  return apiRequest<TrainingProgress>(`/api/training/${id}/status`);
}
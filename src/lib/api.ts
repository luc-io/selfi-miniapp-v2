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

export interface UploadResponse {
  upload_id?: string;
  chunk_size?: number;
  total_chunks?: number;
  images_data_url?: string;
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

export async function uploadTrainingFiles(formData: FormData) {
  const images = formData.getAll('images') as File[];
  const captions = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('captions['))
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key.match(/\[(.*?)\]/)?.[1] ?? '']: value
    }), {});

  // If total size is small enough, use direct upload
  const totalSize = images.reduce((acc, file) => acc + file.size, 0);
  if (totalSize <= CHUNK_SIZE) {
    return apiRequest<{ images_data_url: string }>('/api/training/upload', {
      method: 'POST',
      body: formData
    });
  }

  // Initialize chunked upload
  const initResponse = await apiRequest<UploadResponse>('/api/training/upload/init', {
    method: 'POST',
    body: JSON.stringify({
      total_size: totalSize,
      file_count: images.length,
      captions
    })
  });

  if (!initResponse.upload_id) {
    throw new Error('Failed to initialize chunked upload');
  }

  // Upload chunks
  const uploadId = initResponse.upload_id;
  const chunkSize = initResponse.chunk_size || CHUNK_SIZE;
  let currentChunk = 0;

  for (const image of images) {
    const chunks = Math.ceil(image.size / chunkSize);
    
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, image.size);
      const chunk = image.slice(start, end);

      const chunkFormData = new FormData();
      chunkFormData.append('chunk', chunk);
      chunkFormData.append('upload_id', uploadId);
      chunkFormData.append('chunk_index', currentChunk.toString());
      chunkFormData.append('file_name', image.name);

      await apiRequest<void>('/api/training/upload/chunk', {
        method: 'POST',
        body: chunkFormData
      });

      currentChunk++;
    }
  }

  // Complete upload
  const finalResponse = await apiRequest<{ images_data_url: string }>('/api/training/upload/complete', {
    method: 'POST',
    body: JSON.stringify({ upload_id: uploadId })
  });

  return finalResponse;
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
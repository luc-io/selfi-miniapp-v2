import { useTelegram } from '@/hooks/useTelegram';

const API_URL = import.meta.env.VITE_API_URL;
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

async function createApiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { webApp } = useTelegram();
  const headers = new Headers(options.headers);
  
  if (webApp?.initDataUnsafe.user) {
    headers.set('x-user-id', webApp.initDataUnsafe.user.id.toString());
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(response.statusText || 'API request failed');
  }

  return response.json();
}

export interface GenerateRequest {
  prompt: string;
  loraId?: string;
  negativePrompt?: string;
  seed?: number;
  numInferenceSteps?: number;
  guidanceScale?: number;
  imageSize?: string;
  numImages?: number;
  syncMode?: boolean;
  outputFormat?: string;
}

export function generateImage(params: GenerateRequest) {
  return createApiRequest('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}
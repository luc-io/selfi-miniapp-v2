// API client for Selfi Bot
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Get Telegram WebApp data
  const webApp = window.Telegram?.WebApp;
  if (!webApp) {
    throw new Error('Telegram WebApp not available');
  }

  // Add headers
  const headers = new Headers(options.headers);
  headers.set('x-user-id', webApp.initDataUnsafe.user.id.toString());
  headers.set('content-type', 'application/json');

  // Make request
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  // Handle errors
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  return response.json();
}

// Generation
export interface GenerateRequest {
  prompt: string;
  negativePrompt?: string;
  loraId?: string;
  seed?: number;
}

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  seed?: number;
  starsUsed: number;
}

export async function generateImage(data: GenerateRequest): Promise<Generation> {
  return fetchApi('/generate', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getGenerations(params: { limit?: number; offset?: number } = {}) {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  return fetchApi(`/generations?${searchParams}`);
}

// Models
export interface LoraModel {
  id: string;
  name: string;
  triggerWord: string;
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';
  previewImageUrl?: string;
  isPublic: boolean;
  createdAt: string;
}

export async function getMyModels(): Promise<LoraModel[]> {
  return fetchApi('/models/me');
}

export async function getPublicModels(params: { 
  limit?: number; 
  offset?: number;
  sort?: 'newest' | 'popular';
} = {}) {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());
  if (params.sort) searchParams.set('sort', params.sort);

  return fetchApi(`/models/public?${searchParams}`);
}

// Training
export interface TrainingRequest {
  name: string;
  triggerWord: string;
  imageUrls: string[];
  instancePrompt: string;
  classPrompt?: string;
  steps?: number;
  learningRate?: number;
}

export interface TrainingResponse {
  modelId: string;
  starsDeducted: number;
  remainingStars: number;
}

export async function startTraining(data: TrainingRequest): Promise<TrainingResponse> {
  return fetchApi('/training/start', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export interface TrainingStatus {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress?: number;
  error?: string;
  previewImageUrl?: string;
}

export async function getTrainingStatus(modelId: string): Promise<TrainingStatus> {
  return fetchApi(`/training/${modelId}/status`);
}

// User
export interface UserBalance {
  balance: number;
  totalSpent: number;
  totalBought: number;
}

export async function getBalance(): Promise<UserBalance> {
  return fetchApi('/stars/balance');
}
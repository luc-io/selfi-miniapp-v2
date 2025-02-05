import type { Model } from '@/types/model';
import type { LoraModel } from '@/types/lora';

const API_BASE = 'https://selfi-dev.blackiris.art/api';

export function buildValidationData(webApp: any): string {
  const {
    auth_date,
    query_id,
    user,
    hash,
    ...rest
  } = webApp.initDataUnsafe;

  return btoa(JSON.stringify({
    auth_date,
    query_id,
    user: typeof user === 'string' ? user : JSON.stringify(user),
    ...rest
  }));
}

export async function getAvailableLoras(): Promise<LoraModel[]> {
  const response = await fetch(`${API_BASE}/loras/available`);
  if (!response.ok) {
    throw new Error('Failed to fetch available LoRAs');
  }
  const models = await response.json();
  return models.map((model: any) => ({
    databaseId: model.databaseId,
    name: model.name,
    triggerWord: model.triggerWord,
    baseModelId: model.baseModelId || '',
    status: model.status,
    previewImageUrl: model.previewImageUrl,
    isPublic: model.isPublic,
    starsRequired: model.starsRequired || 0,
    userDatabaseId: model.userDatabaseId || '',
    createdAt: model.createdAt,
    updatedAt: model.updatedAt || model.createdAt
  }));
}

export async function getUserModels(): Promise<Model[]> {
  try {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) throw new Error('Telegram WebApp not available');
    const userId = webApp.initDataUnsafe?.user?.id?.toString();
    if (!userId) throw new Error('Telegram user ID not available');

    const validationData = buildValidationData(webApp);
    console.log('Making request to /loras/user with:', {
      userId,
      validationData
    });

    const response = await fetch(`${API_BASE}/loras/user`, {
      headers: {
        'x-telegram-init-data': validationData,
        'x-telegram-user-id': userId,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch user models');
    }
    return responseData;
  } catch (error) {
    console.error('getUserModels error:', error);
    throw error;
  }
}

export async function toggleModelPublic(modelId: string, isPublic: boolean): Promise<void> {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) throw new Error('Telegram WebApp not available');
  const userId = webApp.initDataUnsafe?.user?.id?.toString();
  if (!userId) throw new Error('Telegram user ID not available');

  const response = await fetch(`${API_BASE}/loras/${modelId}/toggle-public`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': buildValidationData(webApp),
      'x-telegram-user-id': userId
    },
    body: JSON.stringify({ isPublic })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to toggle model visibility');
  }
}

export async function deleteUserModel(modelId: string): Promise<void> {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) throw new Error('Telegram WebApp not available');
  const userId = webApp.initDataUnsafe?.user?.id?.toString();
  if (!userId) throw new Error('Telegram user ID not available');

  const response = await fetch(`${API_BASE}/loras/${modelId}`, {
    method: 'DELETE',
    headers: {
      'x-telegram-init-data': buildValidationData(webApp),
      'x-telegram-user-id': userId
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete model');
  }
}
import type { Model } from '@/types/model';
import type { LoraModel } from '@/types/lora';

const API_BASE = 'https://selfi-dev.blackiris.art/api';

// Build Telegram validation data string
function buildValidationData(webApp: any): string {
  const {
    query_id,
    user,
    auth_date,
    hash,
    ...rest
  } = webApp.initDataUnsafe;

  const sorted = Object.entries({
    auth_date,
    query_id,
    user: JSON.stringify(user),
    ...rest
  })
    .filter(([_, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  return sorted;
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
  const webApp = window.Telegram?.WebApp;
  if (!webApp) throw new Error('Telegram WebApp not available');
  const userId = webApp.initDataUnsafe?.user?.id?.toString();
  if (!userId) throw new Error('Telegram user ID not available');

  const response = await fetch(`${API_BASE}/loras/user`, {
    headers: {
      'x-telegram-init-data': buildValidationData(webApp),
      'x-telegram-user-id': userId
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user models');
  }
  return response.json();
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
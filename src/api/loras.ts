import type { Model } from '@/types/model';
import type { LoraModel } from '@/types/lora';

const API_BASE = 'https://selfi-dev.blackiris.art/api';

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

  const params = new URLSearchParams({
    user_id: webApp.initDataUnsafe?.user?.id?.toString() || '',
    auth_date: webApp.initDataUnsafe?.auth_date || '',
    hash: webApp.initDataUnsafe?.hash || ''
  });

  const response = await fetch(`${API_BASE}/loras/user?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user models');
  }
  return response.json();
}

export async function toggleModelPublic(modelId: string, isPublic: boolean): Promise<void> {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) throw new Error('Telegram WebApp not available');

  const params = new URLSearchParams({
    auth_date: webApp.initDataUnsafe?.auth_date || '',
    hash: webApp.initDataUnsafe?.hash || ''
  });

  const response = await fetch(`${API_BASE}/loras/${modelId}/toggle-public?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-user-id': webApp.initDataUnsafe?.user?.id?.toString() || ''
    },
    body: JSON.stringify({ isPublic })
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle model visibility');
  }
}

export async function deleteUserModel(modelId: string): Promise<void> {
  const webApp = window.Telegram?.WebApp;
  if (!webApp) throw new Error('Telegram WebApp not available');

  const params = new URLSearchParams({
    auth_date: webApp.initDataUnsafe?.auth_date || '',
    hash: webApp.initDataUnsafe?.hash || ''
  });

  const response = await fetch(`${API_BASE}/loras/${modelId}?${params.toString()}`, {
    method: 'DELETE',
    headers: {
      'x-telegram-user-id': webApp.initDataUnsafe?.user?.id?.toString() || ''
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete model');
  }
}
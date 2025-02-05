import type { Model } from '@/types/model';
import type { LoraModel } from '@/types/lora';

export async function getAvailableLoras(): Promise<LoraModel[]> {
  const response = await fetch('http://localhost:3001/api/loras/available');
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
  const response = await fetch('http://localhost:3001/api/loras/user', {
    headers: {
      'x-telegram-init-data': window.Telegram?.WebApp?.initData || '',
      'x-telegram-user-id': window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || ''
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user models');
  }
  return response.json();
}

export async function toggleModelPublic(modelId: string, isPublic: boolean): Promise<void> {
  const response = await fetch(`http://localhost:3001/api/loras/${modelId}/toggle-public`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': window.Telegram?.WebApp?.initData || '',
      'x-telegram-user-id': window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || ''
    },
    body: JSON.stringify({ isPublic })
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle model visibility');
  }
}

export async function deleteUserModel(modelId: string): Promise<void> {
  const response = await fetch(`http://localhost:3001/api/loras/${modelId}`, {
    method: 'DELETE',
    headers: {
      'x-telegram-init-data': window.Telegram?.WebApp?.initData || '',
      'x-telegram-user-id': window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || ''
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete model');
  }
}
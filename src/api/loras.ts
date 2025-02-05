import type { Model } from '@/types/model';
import type { LoraModel } from '@/types/lora';

const API_BASE = '/api';

export async function getAvailableLoras(): Promise<LoraModel[]> {
  const response = await fetch(`${API_BASE}/loras/available`);
  if (!response.ok) {
    throw new Error('Failed to fetch available LoRAs');
  }
  const models = await response.json();
  return models.map((model: Model) => ({
    databaseId: model.id,
    name: model.name,
    triggerWord: model.triggerWord,
    weightsUrl: model.weightsUrl,
    configUrl: model.configUrl,
    baseModelId: '',  // Added in server response
    status: model.status,
    previewImageUrl: null,
    isPublic: model.isPublic,
    starsRequired: 0,  // Added in server response
    userDatabaseId: '',  // Added in server response
    createdAt: model.createdAt,
    updatedAt: model.createdAt,
  }));
}

export async function getUserModels(): Promise<Model[]> {
  const response = await fetch(`${API_BASE}/loras/user`);
  if (!response.ok) {
    throw new Error('Failed to fetch user models');
  }
  return response.json();
}

export async function toggleModelPublic(modelId: string, isPublic: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/loras/${modelId}/toggle-public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isPublic })
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle model visibility');
  }
}

export async function deleteUserModel(modelId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/loras/${modelId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete model');
  }
}
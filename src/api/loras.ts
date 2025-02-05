import type { Model } from '@/types/model';

const API_BASE = '/api';

export async function getAvailableLoras(): Promise<Model[]> {
  const response = await fetch(`${API_BASE}/loras/available`);
  if (!response.ok) {
    throw new Error('Failed to fetch available LoRAs');
  }
  return response.json();
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
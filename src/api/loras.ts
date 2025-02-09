import { buildHeaders } from './utils';
import type { Model } from '@/types/model';

export async function getUserModels(): Promise<Model[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loras/user`, {
    headers: buildHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user models');
  }

  return response.json();
}

export async function getAvailableLoras(): Promise<Model[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loras/available`, {
    headers: buildHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch available loras');
  }

  return response.json();
}

export async function toggleModelSelection(modelId: string, isSelected: boolean): Promise<Model> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/loras/${modelId}/toggle-selection`,
    {
      method: 'POST',
      headers: {
        ...buildHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isSelected })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to toggle model selection');
  }

  return response.json();
}

export async function toggleModelPublic(modelId: string, isPublic: boolean): Promise<Model> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/loras/${modelId}/toggle-public`,
    {
      method: 'POST',
      headers: {
        ...buildHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isPublic })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to toggle model public status');
  }

  return response.json();
}

export async function deleteUserModel(modelId: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/loras/${modelId}`,
    {
      method: 'DELETE',
      headers: buildHeaders()
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete model');
  }
}

export function buildValidationData(webApp: any): string | null {
  if (!webApp.initData) return null;
  return webApp.initData;
}
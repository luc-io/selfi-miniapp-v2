import type { LoraModel } from '@/types/lora';

export async function getAvailableLoras(): Promise<LoraModel[]> {
  const response = await fetch('/api/loras/available');
  if (!response.ok) {
    throw new Error('Failed to fetch available LoRAs');
  }
  return response.json();
}
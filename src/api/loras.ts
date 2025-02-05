import type { Model } from '@/types/model';
import type { LoraModel } from '@/types/lora';

const MOCK_MODELS: Model[] = [
  {
    id: '1',
    name: 'Style Model 1',
    triggerWord: "style_01",
    status: 'COMPLETED',
    isPublic: true,
    isActive: true,
    createdAt: '2024-02-04T00:00:00Z',
    input: {
      steps: 100,
      is_style: true,
      create_masks: false,
      trigger_word: 'style_01'
    }
  },
  {
    id: '2',
    name: 'Training Model',
    triggerWord: "portrait_02",
    status: 'TRAINING',
    isPublic: false,
    isActive: false,
    createdAt: '2024-02-05T00:00:00Z',
    input: {
      steps: 200,
      is_style: false,
      create_masks: true,
      trigger_word: 'portrait_02'
    }
  }
];

export async function getAvailableLoras(): Promise<LoraModel[]> {
  return MOCK_MODELS.map(model => ({
    databaseId: model.id,
    name: model.name,
    triggerWord: model.triggerWord,
    baseModelId: 'mock-base-id',
    status: model.status,
    previewImageUrl: null,
    isPublic: model.isPublic,
    starsRequired: 0,
    userDatabaseId: 'mock-user-id',
    createdAt: model.createdAt,
    updatedAt: model.createdAt
  }));
}

export async function getUserModels(): Promise<Model[]> {
  return Promise.resolve(MOCK_MODELS);
}

export async function toggleModelPublic(modelId: string, isPublic: boolean): Promise<void> {
  console.log('Toggle model', modelId, 'to', isPublic);
  return Promise.resolve();
}

export async function deleteUserModel(modelId: string): Promise<void> {
  console.log('Delete model', modelId);
  return Promise.resolve();
}
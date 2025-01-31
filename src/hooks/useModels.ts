import { useQuery } from '@tanstack/react-query';
import type { Model } from '@/types';

async function fetchModels() {
  const response = await fetch('/api/models');
  return response.json() as Promise<Model[]>;
}

async function fetchPublicModels() {
  const response = await fetch('/api/models/public');
  return response.json() as Promise<Model[]>;
}

export function useModels() {
  const { data: models = [] } = useQuery<Model[]>({
    queryKey: ['models'],
    queryFn: fetchModels
  });

  const { data: publicModels = [] } = useQuery<Model[]>({
    queryKey: ['models', 'public'],
    queryFn: fetchPublicModels
  });

  function getModel(modelId: string): Model | undefined {
    const model = models.find((m: Model) => m.id === modelId);
    if (model) return model;

    return publicModels.find((m: Model) => m.id === modelId);
  }

  return {
    models,
    publicModels,
    getModel
  };
}
import { useQuery } from '@tanstack/react-query';
import type { Model } from '@/types';

// Sample data for development
const SAMPLE_MODELS: Model[] = [
  { id: '1', name: 'SDXL Base', type: 'public' },
  { id: '2', name: 'SDXL Turbo', type: 'public' },
  { id: '3', name: 'DallE', type: 'public' },
];

async function fetchModels() {
  // For development, return sample data
  return SAMPLE_MODELS;
}

async function fetchPublicModels() {
  // For development, return sample data
  return SAMPLE_MODELS.filter(model => model.type === 'public');
}

export function useModels() {
  const { data: models = SAMPLE_MODELS } = useQuery<Model[]>({
    queryKey: ['models'],
    queryFn: fetchModels,
    initialData: SAMPLE_MODELS,
  });

  const { data: publicModels = SAMPLE_MODELS } = useQuery<Model[]>({
    queryKey: ['models', 'public'],
    queryFn: fetchPublicModels,
    initialData: SAMPLE_MODELS,
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
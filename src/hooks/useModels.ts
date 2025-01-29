import { useQuery } from '@tanstack/react-query';
import { getMyModels, getPublicModels } from '@/api';

export function useMyModels() {
  return useQuery({
    queryKey: ['models', 'my'],
    queryFn: getMyModels
  });
}

export function usePublicModels(options?: {
  limit?: number;
  offset?: number;
  sort?: 'newest' | 'popular';
}) {
  return useQuery({
    queryKey: ['models', 'public', options],
    queryFn: () => getPublicModels(options)
  });
}

export function useModel(modelId: string) {
  return useQuery({
    queryKey: ['models', modelId],
    queryFn: async () => {
      // First try public models
      const publicModels = await getPublicModels();
      const publicModel = publicModels.find(m => m.id === modelId);
      if (publicModel) return publicModel;

      // Then try user's models
      const myModels = await getMyModels();
      const myModel = myModels.find(m => m.id === modelId);
      if (myModel) return myModel;

      throw new Error('Model not found');
    }
  });
}
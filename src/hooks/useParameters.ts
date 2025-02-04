import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { GenerationParameters } from '@/types';
import { getUserParameters } from '@/api/parameters';

const defaultParameters: GenerationParameters = {
  image_size: 'landscape_4_3',
  num_inference_steps: 28,
  seed: Math.floor(Math.random() * 1000000),
  guidance_scale: 3.5,
  num_images: 1,
  sync_mode: false,
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function useParameters() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['parameters'],
    queryFn: async () => {
      try {
        const response = await getUserParameters();
        if (response?.params) {
          return response.params;
        }
        return defaultParameters;
      } catch (error) {
        console.error('Error fetching parameters:', error);
        return defaultParameters;
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 60000, // Keep in cache for 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2
  });

  return {
    parameters: data || defaultParameters,
    isLoading,
    error,
    invalidateParameters: () => queryClient.invalidateQueries({ queryKey: ['parameters'] })
  };
}
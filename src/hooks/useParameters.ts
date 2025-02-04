import { useQuery } from '@tanstack/react-query';
import type { GenerationParameters } from '@/types';

export function useParameters() {
  const { data: parameters, isLoading, error } = useQuery<GenerationParameters>({
    queryKey: ['parameters'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/parameters');
        if (!response.ok) {
          throw new Error('Failed to fetch parameters');
        }
        return response.json();
      } catch (error) {
        console.error('Error loading parameters:', error);
        return null;
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 60000, // Keep in cache for 1 minute
  });

  return {
    parameters,
    isLoading,
    error,
  };
}
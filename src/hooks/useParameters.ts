import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { GenerationParameters } from '@/types';
import { getUserParameters } from '@/api/parameters';

export function useParameters() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['parameters'],
    queryFn: async () => {
      try {
        const response = await getUserParameters();
        if (response?.params) {
          // Ensure sync_mode is not included
          const { sync_mode, ...params } = response.params;
          return params;
        }
        return null;
      } catch (error) {
        console.error('Error fetching parameters:', error);
        return null;
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 60000, // Keep in cache for 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2
  });

  return {
    parameters: data,
    isLoading,
    error,
    invalidateParameters: () => queryClient.invalidateQueries({ queryKey: ['parameters'] })
  };
}
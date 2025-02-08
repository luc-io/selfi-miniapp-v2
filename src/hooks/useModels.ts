import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserModels, toggleModelPublic, deleteModel, buildValidationData } from '@/api/loras';
import type { Model } from '@/types/model';

export function useModels() {
  const queryClient = useQueryClient();
  
  const { data: models = [], isLoading, error } = useQuery<Model[]>({
    queryKey: ['models', 'user'],
    queryFn: async () => {
      console.log('Fetching user models...');
      console.log('Telegram data:', {
        userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
        validationData: window.Telegram?.WebApp ? buildValidationData(window.Telegram.WebApp) : null
      });
      const data = await getUserModels();
      console.log('User models response:', data);
      return data;
    },
    retry: 1,
    retryDelay: 1000
  });

  const toggleActivation = useMutation({
    mutationFn: ({ modelId, isActive }: { modelId: string; isActive: boolean }) => 
      toggleModelPublic(modelId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
    },
  });

  const deleteModelMutation = useMutation({
    mutationFn: deleteModel,
    onMutate: async (modelId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['models', 'user'] });

      // Snapshot the previous value
      const previousModels = queryClient.getQueryData<Model[]>(['models', 'user']);

      // Optimistically remove the model from the list
      queryClient.setQueryData<Model[]>(['models', 'user'], old => 
        old?.filter(model => model.databaseId !== modelId) ?? []
      );

      // Return context with the previous models
      return { previousModels };
    },
    onError: (err, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousModels) {
        queryClient.setQueryData(['models', 'user'], context.previousModels);
      }
      console.error('Error deleting model:', err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
    },
  });

  return {
    models,
    isLoading,
    error,
    toggleActivation: toggleActivation.mutate,
    isToggling: toggleActivation.isPending,
    deleteModel: deleteModelMutation.mutate,
    isDeleting: deleteModelMutation.isPending,
  };
}
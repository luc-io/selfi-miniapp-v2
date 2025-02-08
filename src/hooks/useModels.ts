import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserModels, toggleModelPublic, deleteUserModel, buildValidationData } from '@/api/loras';
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
  });

  const toggleActivation = useMutation({
    mutationFn: ({ modelId, isActive }: { modelId: string; isActive: boolean }) => 
      toggleModelPublic(modelId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
    },
  });

  const deleteModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      await deleteUserModel(modelId);
      return modelId; // Return the modelId for optimistic updates
    },
    onMutate: async (modelId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['models', 'user'] });
      // Snapshot the previous value
      const previousModels = queryClient.getQueryData<Model[]>(['models', 'user']);
      // Optimistically update to the new value
      queryClient.setQueryData<Model[]>(['models', 'user'], (old) => 
        old?.filter(model => model.databaseId !== modelId) ?? []
      );
      // Return a context object with the snapshotted value
      return { previousModels };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousModels) {
        queryClient.setQueryData(['models', 'user'], context.previousModels);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
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
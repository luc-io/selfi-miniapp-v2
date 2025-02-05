import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserModels, toggleModelPublic, deleteUserModel } from '@/api/loras';
import type { Model } from '@/types/model';

export function useModels() {
  const queryClient = useQueryClient();
  
  const { data: models = [], isLoading, error } = useQuery<Model[]>({
    queryKey: ['models', 'user'],
    queryFn: getUserModels,
  });

  const toggleActivation = useMutation({
    mutationFn: ({ modelId, isActive }: { modelId: string; isActive: boolean }) => 
      toggleModelPublic(modelId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
    },
  });

  const deleteModelMutation = useMutation({
    mutationFn: deleteUserModel,
    onSuccess: () => {
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
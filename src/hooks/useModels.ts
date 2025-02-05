import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getModels, toggleModelActivation, deleteModel, downloadModelConfig } from '@/api/models';

export function useModels() {
  const queryClient = useQueryClient();

  const { data: models, isLoading, error } = useQuery({
    queryKey: ['models'],
    queryFn: getModels
  });

  const toggleActivation = useMutation({
    mutationFn: ({ modelId, isActive }: { modelId: number; isActive: boolean }) => 
      toggleModelActivation(modelId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
    }
  });

  const downloadConfig = async (modelId: number, filename: string) => {
    try {
      const blob = await downloadModelConfig(modelId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error downloading config:', error);
      window.Telegram?.WebApp?.showPopup({
        message: 'Failed to download config file. Please try again.'
      });
    }
  };

  return { 
    models, 
    isLoading, 
    error,
    toggleActivation: toggleActivation.mutate,
    isToggling: toggleActivation.isPending,
    deleteModel: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    downloadConfig
  };
}
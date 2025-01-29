import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateImage, type GenerateRequest } from '@/api';

export function useGenerateImage() {
  const queryClient = useQueryClient();
  const { mutateAsync: generate, isPending: isGenerating } = useMutation({
    mutationFn: generateImage,
    onSuccess: (data) => {
      // Invalidate generations query to show new result
      queryClient.invalidateQueries({ queryKey: ['generations'] });

      // Scroll image into view
      setTimeout(() => {
        const img = document.getElementById(`generation-${data.id}`);
        img?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    },
    onError: (error) => {
      // Show Telegram notification
      window.Telegram?.WebApp?.showAlert(
        error instanceof Error ? error.message : 'Failed to generate image'
      );
    }
  });

  return {
    generate,
    isGenerating
  };
}

export function useGenerations() {
  return useQuery({
    queryKey: ['generations'],
    queryFn: getGenerations
  });
}
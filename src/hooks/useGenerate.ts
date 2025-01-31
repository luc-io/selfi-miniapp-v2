import { useMutation, useQuery } from '@tanstack/react-query';
import { generateImage } from '@/api';
import type { Generation } from '@/types';
import { useTelegram } from './useTelegram';

interface GenerateParams {
  prompt: string;
  loraId?: string;
  negativePrompt?: string;
  seed?: number;
  numInferenceSteps?: number;
  guidanceScale?: number;
  imageSize?: string;
  numImages?: number;
  syncMode?: boolean;
  outputFormat?: string;
}

export function useGenerate() {
  const { tg } = useTelegram();

  const mutation = useMutation({
    mutationFn: generateImage,
    onError: (error) => {
      tg?.showPopup({
        title: 'Error',
        message: error.message || 'Failed to generate image'
      });
    }
  });

  return mutation;
}

export function useGenerations() {
  const { data: generations = [] } = useQuery<Generation[]>({
    queryKey: ['generations'],
    queryFn: () => fetch('/api/generations').then(res => res.json())
  });

  return generations;
}
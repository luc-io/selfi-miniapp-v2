import { useMutation, useQuery } from '@tanstack/react-query';
import { generateImage } from '@/api';
import type { Generation } from '@/types';
import { useTelegram } from './useTelegram';

export function useGenerate() {
  const { webApp } = useTelegram();

  const mutation = useMutation({
    mutationFn: generateImage,
    onError: (error) => {
      webApp?.showPopup({
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
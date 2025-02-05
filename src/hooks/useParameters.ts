import { useState } from 'react';
import type { GenerationParameters } from '@/types';

const defaultParameters: GenerationParameters = {
  image_size: 'portrait_16_9',
  num_inference_steps: 48,
  seed: 334370,
  guidance_scale: 20,
  num_images: 1,
  sync_mode: false,
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function useParameters() {
  const [parameters, setParameters] = useState<GenerationParameters>(defaultParameters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const invalidateParameters = async () => {
    setIsLoading(true);
    try {
      // Add your parameter fetching logic here
      setParameters(defaultParameters);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch parameters'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    parameters,
    setParameters,
    isLoading,
    error,
    invalidateParameters
  };
}
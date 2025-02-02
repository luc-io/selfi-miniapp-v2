import { useEffect } from 'react';
import type { Model } from '@/types';
import type { ModelSelectorProps } from './types';

const FLUX_LORA: Model = {
  id: 'flux-lora',
  name: 'Flux Lora',
  type: 'public'
};

export function ModelSelector({ onSelect, defaultValue }: ModelSelectorProps) {
  // Auto-select Flux Lora on mount if no default value
  useEffect(() => {
    if (!defaultValue) {
      onSelect(FLUX_LORA);
    }
  }, [onSelect, defaultValue]);

  return null; // Don't render anything since model is fixed
}
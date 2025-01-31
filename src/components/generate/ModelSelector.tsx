import { useEffect } from 'react';
import type { ModelSelectorProps } from './types';

const FLUX_LORA: any = {
  id: 'flux-lora',
  name: 'Flux Lora',
  type: 'public'
};

export function ModelSelector({ onSelect }: ModelSelectorProps) {
  // Auto-select Flux Lora on mount
  useEffect(() => {
    onSelect(FLUX_LORA);
  }, [onSelect]);

  return null; // Don't render anything since model is fixed
}
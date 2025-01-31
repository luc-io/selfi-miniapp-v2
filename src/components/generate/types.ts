import type { Model } from '@/types';

export interface ModelSelectorProps {
  onSelect: (model: Model | undefined) => void;
}

export interface AdvancedOptionsProps {
  onChange: (options: { negativePrompt?: string; seed?: number }) => void;
}
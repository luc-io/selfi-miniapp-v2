import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { ModelSelectorProps } from './types';

const DEFAULT_MODEL_PATH = 'fal-ai/flux-lora';

export function ModelSelector({ onSelect, defaultValue }: ModelSelectorProps) {
  // Automatically select default model
  useEffect(() => {
    onSelect(defaultValue || DEFAULT_MODEL_PATH);
  }, [defaultValue, onSelect]);

  return (
    <Card className="relative border-none bg-transparent shadow-none">
      <CardContent className="p-0">
        <div className="relative w-full max-w-[800px] mx-auto">
          <img
            src="/assets/images/flux-model.png"
            alt="Flux Model"
            className="w-full h-[160px] object-cover rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
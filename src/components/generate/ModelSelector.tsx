import { useState } from 'react';
import type { Model } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SparklesIcon } from 'lucide-react';

interface ModelSelectorProps {
  defaultValue?: Model;
  onSelect: (model: Model) => void;
}

const DEFAULT_MODEL: Model = {
  modelPath: 'fal-ai/flux-lora'
};

export function ModelSelector({ onSelect, defaultValue }: ModelSelectorProps) {
  const [selectedModel] = useState<Model>(defaultValue || DEFAULT_MODEL);

  return (
    <Card className="relative border-none bg-transparent shadow-none">
      <CardContent className="flex gap-2 p-0">
        <Button
          size="sm"
          variant="default"
          className="flex items-center gap-1.5"
        >
          <SparklesIcon className="h-4 w-4" />
          Flux
        </Button>
      </CardContent>
    </Card>
  );
}
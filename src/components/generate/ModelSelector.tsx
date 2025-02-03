import { useEffect, useState } from 'react';
import type { Model } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CrownIcon, SparklesIcon } from 'lucide-react';

export interface ModelSelectorProps {
  onSelect: (model: Model | undefined) => void;
  selectedModel?: Model;
}

const MODELS: Model[] = [
  {
    id: 'fal.ai/fal-ai/flux-lora',
    name: 'Flux',
    type: 'public'
  },
  {
    id: 'fal.ai/fal-ai/flux-pro/v1.1-ultra-finetuned',
    name: 'Flux Pro',
    type: 'public'
  }
];

export function ModelSelector({ onSelect, selectedModel: initialModel }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<Model>(() => 
    initialModel || MODELS[0]
  );

  // Update selected model when initialModel changes
  useEffect(() => {
    if (initialModel && initialModel.id !== selectedModel.id) {
      setSelectedModel(initialModel);
    }
  }, [initialModel]);

  // Auto-select first model on mount
  useEffect(() => {
    onSelect(selectedModel);
  }, [onSelect, selectedModel]);

  const handleSelect = (model: Model) => {
    setSelectedModel(model);
    onSelect(model);
  };

  return (
    <Card className="relative border-none bg-transparent shadow-none">
      <CardContent className="flex gap-2 p-0">
        {MODELS.map((model) => (
          <Button
            key={model.id}
            size="sm"
            variant={selectedModel.id === model.id ? "default" : "ghost"}
            className="flex items-center gap-1.5"
            onClick={() => handleSelect(model)}
          >
            {model.name === 'Flux Pro' ? (
              <CrownIcon className="h-4 w-4" />
            ) : (
              <SparklesIcon className="h-4 w-4" />
            )}
            {model.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
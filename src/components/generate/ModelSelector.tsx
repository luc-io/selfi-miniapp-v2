import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SparklesIcon } from 'lucide-react';
import type { ModelSelectorProps } from './types';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

const DEFAULT_MODEL_PATH = 'fal-ai/flux-lora';

export function ModelSelector({ onSelect, defaultValue }: ModelSelectorProps) {
  const themeParams = useTelegramTheme();

  // Automatically select default model
  useEffect(() => {
    onSelect(defaultValue || DEFAULT_MODEL_PATH);
  }, [defaultValue, onSelect]);

  return (
    <Card className="relative border-none bg-transparent shadow-none">
      <CardContent className="flex gap-2 p-0">
        <Button
          variant="default"
          className="flex items-center gap-1.5 py-2 px-3 h-8 text-xs"
          style={{
            backgroundColor: themeParams.button_color,
            color: themeParams.button_text_color,
          }}
        >
          <SparklesIcon className="h-4 w-4" />
          Flux
        </Button>
      </CardContent>
    </Card>
  );
}
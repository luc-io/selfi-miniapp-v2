import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SparklesIcon } from 'lucide-react';

interface ModelSelectorProps {
  defaultValue: string;
  onSelect: (modelPath: string) => void;
}

export function ModelSelector({ onSelect, defaultValue }: ModelSelectorProps) {
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
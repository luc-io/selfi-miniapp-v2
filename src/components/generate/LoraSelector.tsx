import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import type { LoraParameter } from '@/types/lora';

interface AvailableLora {
  path: string;
  name: string;
  triggerWord: string;
}

interface LoraSelectorProps {
  loras: LoraParameter[];
  availableLoras: AvailableLora[];
  onAdd: (lora: LoraParameter) => void;
  onRemove: (index: number) => void;
  onScaleChange: (index: number, scale: number) => void;
}

export function LoraSelector({ loras, availableLoras, onAdd, onRemove, onScaleChange }: LoraSelectorProps) {
  // Helper function to check if a LoRA is selected
  const isLoraSelected = (path: string) => loras.some(lora => lora.path === path);
  
  // Helper function to handle LoRA click
  const handleLoraClick = (path: string) => {
    if (!isLoraSelected(path) && loras.length < 5) {
      onAdd({ path, scale: 1.0 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Available LoRAs grid - only show if not at limit */}
      {loras.length < 5 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {availableLoras
            .filter(lora => !isLoraSelected(lora.path))
            .map((lora) => (
              <button
                key={lora.path}
                onClick={() => handleLoraClick(lora.path)}
                className="p-3 text-left transition-colors bg-card hover:bg-accent border border-border"
              >
                <span className="block font-medium truncate text-card-foreground">
                  {lora.triggerWord}
                </span>
              </button>
            ))}
        </div>
      )}

      {/* Selected LoRAs list */}
      <div className="space-y-2">
        {loras.map((lora, index) => {
          const loraInfo = availableLoras.find(l => l.path === lora.path);
          return (
            <div 
              key={index} 
              className="bg-card border border-border overflow-hidden"
            >
              <div className="p-3 flex items-center justify-between bg-muted border-b border-border">
                <span className="font-medium text-card-foreground">
                  {loraInfo?.triggerWord || lora.path}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(index)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 flex items-center gap-4">
                <div className="flex-grow">
                  <Slider
                    value={[lora.scale]}
                    onValueChange={(values) => onScaleChange(index, values[0])}
                    min={0}
                    max={2}
                    step={0.01}
                    className="py-2"
                  />
                </div>
                <span className="text-sm text-card-foreground w-12 text-right">
                  {lora.scale.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
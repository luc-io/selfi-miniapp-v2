import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import type { LoraParameter } from '@/types/lora';

interface LoraSelectorProps {
  loras: LoraParameter[];
  availableLoras: { path: string; name: string }[];
  onAdd: (lora: LoraParameter) => void;
  onRemove: (index: number) => void;
  onScaleChange: (index: number, scale: number) => void;
}

export function LoraSelector({ loras, availableLoras, onAdd, onRemove, onScaleChange }: LoraSelectorProps) {
  const [selectedPath, setSelectedPath] = useState<string>('');

  const handleAdd = () => {
    if (selectedPath) {
      onAdd({ path: selectedPath, scale: 1.0 });
      setSelectedPath('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={selectedPath} onValueChange={setSelectedPath}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a LoRA" />
          </SelectTrigger>
          <SelectContent>
            {availableLoras.map((lora) => (
              <SelectItem key={lora.path} value={lora.path}>
                {lora.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={handleAdd} 
          disabled={!selectedPath || loras.length >= 5}
          className="whitespace-nowrap"
        >
          Add LoRA
        </Button>
      </div>

      {loras.map((lora, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-grow space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">
                {availableLoras.find(l => l.path === lora.path)?.name || lora.path}
              </span>
              <span className="text-gray-500">
                {lora.scale.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[lora.scale]}
              onValueChange={(values) => onScaleChange(index, values[0])}
              min={0}
              max={2}
              step={0.01}
              className="py-2"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
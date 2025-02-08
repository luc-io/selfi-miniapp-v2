import { useState } from 'react';
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
      {/* Selected LoRAs with scale adjustment */}
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

      {/* Available LoRAs grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {availableLoras.map((lora) => {
          const selected = isLoraSelected(lora.path);
          return (
            <button
              key={lora.path}
              onClick={() => handleLoraClick(lora.path)}
              disabled={selected || loras.length >= 5}
              className={`
                p-3 rounded-lg text-left transition-colors
                ${selected 
                  ? 'bg-blue-100 text-blue-900 cursor-default' 
                  : loras.length >= 5 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <span className="block font-medium truncate">
                {lora.name}
              </span>
            </button>
          );
        })}      </div>
    </div>
  );
}
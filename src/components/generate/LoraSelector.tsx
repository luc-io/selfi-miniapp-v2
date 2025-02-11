import { useState } from 'react';
import { Slider } from '../ui/slider';
import { Trash2, Info } from 'lucide-react';
import type { LoraParameter } from '@/types/lora';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

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
  const themeParams = useTelegramTheme();
  const [showHelp, setShowHelp] = useState(false);

  const isLoraSelected = (path: string) => loras.some(lora => lora.path === path);
  
  const handleLoraClick = (path: string) => {
    if (!isLoraSelected(path) && loras.length < 5) {
      onAdd({ path, scale: 1.0 });
    }
  };

  const buttonStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}66`,
  };

  const selectedItemStyle = {
    backgroundColor: themeParams.bg_color,
    borderColor: `${themeParams.button_color}66`,
  };

  const headerStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    borderColor: `${themeParams.button_color}66`,
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label 
            className="text-sm font-medium" 
            style={{ color: themeParams.text_color }}
          >
            LoRAs
          </label>
          <button 
            type="button" 
            className="hover:opacity-80 transition-opacity focus:outline-none"
            onClick={() => setShowHelp(!showHelp)}
            aria-label="Toggle LoRA info"
          >
            <Info 
              className="h-3.5 w-3.5" 
              style={{ color: themeParams.hint_color }} 
            />
          </button>
        </div>
        {showHelp && (
          <p 
            className="text-sm" 
            style={{ color: themeParams.hint_color }}
          >
            The LoRAs to use for the image generation. You can use any number of LoRAs and they will be merged together to generate the final image.
          </p>
        )}
      </div>

      {loras.length < 5 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {availableLoras
            .filter(lora => !isLoraSelected(lora.path))
            .map((lora) => (
              <button
                key={lora.path}
                onClick={() => handleLoraClick(lora.path)}
                className="p-3 text-left transition-colors border hover:opacity-80"
                style={buttonStyle}
              >
                <span className="block font-medium truncate">
                  {lora.triggerWord}
                </span>
              </button>
            ))}
        </div>
      )}

      <div className="space-y-2">
        {loras.map((lora, index) => {
          const loraInfo = availableLoras.find(l => l.path === lora.path);
          return (
            <div 
              key={index} 
              className="overflow-hidden border"
              style={selectedItemStyle}
            >
              <div className="p-3 flex items-center justify-between border-b" style={headerStyle}>
                <span className="font-medium" style={{ color: themeParams.text_color }}>
                  {loraInfo?.triggerWord || lora.path}
                </span>
                <button
                  onClick={() => onRemove(index)}
                  className="p-2 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
                  style={{ color: themeParams.button_color }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
                    style={{
                      '--slider-thumb-bg': themeParams.button_color,
                      '--slider-track-bg': themeParams.button_color,
                    } as React.CSSProperties}
                  />
                </div>
                <span className="text-sm w-12 text-right" style={{ color: themeParams.text_color }}>
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
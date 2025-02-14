import { useState } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { TelegramThemeParams } from '@/types/telegram';

interface NumImagesInputProps {
  value?: number;  // Made optional
  onChange: (value: number) => void;
  onReset: () => void;
  themeParams: TelegramThemeParams;
}

const DEFAULT_VALUE = 1;

export function NumImagesInput({ value = DEFAULT_VALUE, onChange, onReset, themeParams }: NumImagesInputProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <label 
              className="block text-sm font-medium" 
              style={{ color: themeParams.text_color }}
            >
              Imágenes
            </label>
            <span 
              className="text-sm"
              style={{ color: themeParams.hint_color }}
            >
              ({value})
            </span>
            <button 
              type="button" 
              className="hover:opacity-80 transition-opacity focus:outline-none"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Ver información de número de imágenes"
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
              Cantidad de imágenes a generar con un prompt
            </p>
          )}
        </div>
        <button 
          onClick={onReset}
          className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
          style={{ color: themeParams.button_color }}
          title="Restablecer al valor predeterminado (1)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <Slider 
        value={[value]}
        onValueChange={(v: number[]) => onChange(v[0])}
        min={1}
        max={4}
        step={1}
        className="py-2"
        style={{
          '--slider-thumb-bg': themeParams.button_color,
          '--slider-track-bg': themeParams.button_color,
        } as React.CSSProperties}
      />
    </div>
  );
}
import { useState } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { TelegramThemeParams } from '@/types/telegram';

interface StepsInputProps {
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
  themeParams: TelegramThemeParams;
}

export function StepsInput({ value, onChange, onReset, themeParams }: StepsInputProps) {
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
              Pasos de inferencia (inference steps)
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
              aria-label="Ver información de pasos de inferencia"
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
              Cuántas veces el modelo refina la imagen. Más pasos = mejor calidad pero más tiempo de generación y potencial colapso del modelo. 28 es el valor por defecto
            </p>
          )}
        </div>
        <button 
          onClick={onReset}
          className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
          style={{ color: themeParams.button_color }}
          title="Restablecer al valor predeterminado (28)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <Slider 
        value={[value]}
        onValueChange={(v: number[]) => onChange(v[0])}
        min={1}
        max={50}
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
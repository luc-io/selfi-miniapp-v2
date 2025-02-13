import { useState } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { TelegramThemeParams } from '@/types/telegram';

interface GuidanceInputProps {
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
  themeParams: TelegramThemeParams;
}

export function GuidanceInput({ value, onChange, onReset, themeParams }: GuidanceInputProps) {
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
              Escala de guía CFG
            </label>
            <span 
              className="text-sm"
              style={{ color: themeParams.hint_color }}
            >
              ({value.toFixed(1)})
            </span>
            <button 
              type="button" 
              className="hover:opacity-80 transition-opacity focus:outline-none"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Ver información de escala de guía"
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
              Controla qué tan fielmente la IA sigue tu prompt. Valores más altos = más fiel al prompt pero potencialmente menos creativo.
            </p>
          )}
        </div>
        <button 
          onClick={onReset}
          className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
          style={{ color: themeParams.button_color }}
          title="Restablecer al valor predeterminado (3.5)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <Slider 
        value={[value]}
        onValueChange={(v: number[]) => onChange(v[0])}
        min={1}
        max={20}
        step={0.1}
        className="py-2"
        style={{
          '--slider-thumb-bg': themeParams.button_color,
          '--slider-track-bg': themeParams.button_color,
        } as React.CSSProperties}
      />
    </div>
  );
}

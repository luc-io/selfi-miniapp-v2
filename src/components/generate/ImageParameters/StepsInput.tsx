import { RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { TelegramThemeParams } from '@/types/telegram';

interface StepsInputProps {
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
  themeParams: TelegramThemeParams;
}

export function StepsInput({ value, onChange, onReset, themeParams }: StepsInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label 
          className="block text-sm font-medium" 
          style={{ color: themeParams.text_color }}
        >
          Pasos de inferencia (inference steps) <span style={{ color: themeParams.hint_color }} className="ml-1">({value})</span>
        </label>
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

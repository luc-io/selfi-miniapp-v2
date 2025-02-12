import { RotateCcw } from 'lucide-react';
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
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label 
          className="block text-sm font-medium" 
          style={{ color: themeParams.text_color }}
        >
          Images <span style={{ color: themeParams.hint_color }} className="ml-1">({value})</span>
        </label>
        <button 
          onClick={onReset}
          className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
          style={{ color: themeParams.button_color }}
          title="Reset to default (1)"
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
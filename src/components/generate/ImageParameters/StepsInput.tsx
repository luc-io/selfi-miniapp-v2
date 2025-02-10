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
  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  const resetButtonStyle = {
    color: themeParams.button_color,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium" style={labelStyle}>
          Steps <span style={hintStyle} className="ml-1">({value})</span>
        </label>
        <button 
          onClick={onReset}
          className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
          style={resetButtonStyle}
          title="Reset to default (28)"
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
      />
    </div>
  );
}
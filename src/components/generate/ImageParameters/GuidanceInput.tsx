import { RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { TelegramTheme } from '@/types';

interface GuidanceInputProps {
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
  themeParams: TelegramTheme;
}

export function GuidanceInput({ value, onChange, onReset, themeParams }: GuidanceInputProps) {
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
          Guidance Scale <span style={hintStyle} className="ml-1">({value})</span>
        </label>
        <button 
          onClick={onReset}
          className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
          style={resetButtonStyle}
          title="Reset to default (3.5)"
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
      />
    </div>
  );
}
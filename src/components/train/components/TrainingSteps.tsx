import { useTelegramTheme } from '@/hooks/useTelegramTheme';

interface TrainingStepsProps {
  value: number;
  onChange: (value: number) => void;
}

export function TrainingSteps({ value, onChange }: TrainingStepsProps) {
  const themeParams = useTelegramTheme();

  const labelStyle = {
    color: themeParams.text_color,
  };

  return (
    <div className="space-y-2">
      <label 
        className="block text-sm font-medium" 
        style={labelStyle}
      >
        Training Steps: {value}
      </label>
      <input
        type="range"
        min={50}
        max={400}
        step={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          backgroundColor: `${themeParams.button_color}20`,
          '--range-thumb-bg': themeParams.button_color,
        } as React.CSSProperties}
      />
      <div className="flex justify-between text-xs" style={labelStyle}>
        <span>50</span>
        <span>400</span>
      </div>
    </div>
  );
}

import { useTelegramTheme } from '@/hooks/useTelegramTheme';

interface TriggerWordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TriggerWordInput({ value, onChange }: TriggerWordInputProps) {
  const themeParams = useTelegramTheme();

  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  return (
    <div className="space-y-2">
      <label 
        className="block text-sm font-medium" 
        style={labelStyle}
      >
        Trigger Word
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., person name, object name"
        className="w-full px-3 py-1.5 rounded-md border text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1"
        style={{
          backgroundColor: themeParams.secondary_bg_color,
          color: themeParams.text_color,
          borderColor: `${themeParams.button_color}20`
        }}
      />
      <p 
        className="text-xs" 
        style={hintStyle}
      >
        Word that will trigger your trained model
      </p>
    </div>
  );
}

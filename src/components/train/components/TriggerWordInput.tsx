import { InfoIcon } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

interface TriggerWordInputProps {
  value: string;
  isStyle: boolean;
  onChange: (value: string) => void;
}

export const TriggerWordInput: React.FC<TriggerWordInputProps> = ({
  value,
  isStyle,
  onChange
}) => {
  const themeParams = useTelegramTheme();

  const labelStyle = {
    color: themeParams.text_color,
  };

  const helpTextStyle = {
    color: themeParams.hint_color,
  };

  const tooltipStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.hint_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const inputStyle = {
    backgroundColor: themeParams.bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label 
          className="block text-sm font-medium" 
          style={labelStyle}
          htmlFor="triggerWord"
        >
          Trigger Word
        </label>
        <div className="group relative">
          <InfoIcon 
            className="w-4 h-4" 
            style={{ color: themeParams.hint_color }}
          />
          <div 
            className="absolute left-0 bottom-6 w-64 p-2 text-xs rounded border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-sm"
            style={tooltipStyle}
          >
            {isStyle 
              ? "Choose a trigger word that represents your style (e.g., 'anime_style', 'watercolor'). This word activates your style during generation."
              : "Choose a trigger word that represents your subject (e.g., 'my_cat', 'my_house'). This word will be used to generate images of your subject."}
          </div>
        </div>
      </div>
      <input
        id="triggerWord"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isStyle 
          ? "Enter trigger word for your style (e.g., anime_style)" 
          : "Enter trigger word for your subject (e.g., my_cat)"}
        className="w-full px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-ring border"
        style={inputStyle}
        required
      />
      <p className="text-xs" style={helpTextStyle}>
        {isStyle 
          ? "This trigger word will be used to apply your trained style to any image" 
          : "This trigger word will be used to reference your trained subject in prompts"}
      </p>
    </div>
  );
};
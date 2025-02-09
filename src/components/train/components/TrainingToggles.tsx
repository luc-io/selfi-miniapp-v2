import { Switch } from '@/components/ui/switch';
import { InfoIcon } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

interface TrainingTogglesProps {
  isStyle: boolean;
  createMasks: boolean;
  onStyleChange: (checked: boolean) => void;
  onMasksChange: (checked: boolean) => void;
}

export const TrainingToggles: React.FC<TrainingTogglesProps> = ({
  isStyle,
  createMasks,
  onStyleChange,
  onMasksChange
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <label 
              className="block text-sm font-medium"
              style={labelStyle}
            >
              Create Masks
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
                When enabled, uses AI to detect and focus on the main subject. Recommended for training specific subjects or people.
              </div>
            </div>
          </div>
          <p className="text-sm" style={helpTextStyle}>
            Use AI to focus on the main subject
          </p>
        </div>
        <Switch
          checked={createMasks}
          onCheckedChange={onMasksChange}
          disabled={isStyle}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <label 
              className="block text-sm font-medium"
              style={labelStyle}
            >
              Style Training
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
                Choose this when training an art style or visual effect, rather than a specific subject.
              </div>
            </div>
          </div>
          <p className="text-sm" style={helpTextStyle}>
            Train for style instead of subject
          </p>
        </div>
        <Switch
          checked={isStyle}
          onCheckedChange={onStyleChange}
        />
      </div>
    </div>
  );
};
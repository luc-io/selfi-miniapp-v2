import { useTelegramTheme } from '@/hooks/useTelegramTheme';

interface TrainingTogglesProps {
  isStyle: boolean;
  createMasks: boolean;
  onStyleChange: (isStyle: boolean) => void;
  onMasksChange: (createMasks: boolean) => void;
}

export function TrainingToggles({
  isStyle,
  createMasks,
  onStyleChange,
  onMasksChange
}: TrainingTogglesProps) {
  const themeParams = useTelegramTheme();

  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label 
            className="text-sm font-medium" 
            style={labelStyle} 
            htmlFor="style-toggle"
          >
            Style Training
          </label>
          <p 
            className="text-xs mt-1" 
            style={hintStyle}
          >
            Enable for training visual styles
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="style-toggle"
            className="sr-only peer"
            checked={isStyle}
            onChange={(e) => onStyleChange(e.target.checked)}
          />
          <div 
            className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
            style={{
              backgroundColor: isStyle ? themeParams.button_color : `${themeParams.button_color}40`
            }}
          />
        </label>
      </div>

      {!isStyle && (
        <div className="flex items-center justify-between">
          <div>
            <label 
              className="text-sm font-medium" 
              style={labelStyle} 
              htmlFor="mask-toggle"
            >
              Create Masks
            </label>
            <p 
              className="text-xs mt-1" 
              style={hintStyle}
            >
              Enable for better subject isolation
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="mask-toggle"
              className="sr-only peer"
              checked={createMasks}
              onChange={(e) => onMasksChange(e.target.checked)}
            />
            <div 
              className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
              style={{
                backgroundColor: createMasks ? themeParams.button_color : `${themeParams.button_color}40`
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
}

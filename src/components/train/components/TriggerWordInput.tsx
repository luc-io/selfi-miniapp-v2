import { InfoIcon } from 'lucide-react';

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
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="block text-sm font-medium text-card-foreground" htmlFor="triggerWord">
          Trigger Word
        </label>
        <div className="group relative">
          <InfoIcon className="w-4 h-4 text-muted-foreground" />
          <div className="absolute left-0 bottom-6 w-64 p-2 bg-popover text-popover-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
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
        className="w-full px-3 py-2 bg-card border border-border text-card-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        required
      />
      <p className="text-xs text-muted-foreground">
        {isStyle 
          ? "This trigger word will be used to apply your trained style to any image" 
          : "This trigger word will be used to reference your trained subject in prompts"}
      </p>
    </div>
  );
};
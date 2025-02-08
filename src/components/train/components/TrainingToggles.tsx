import { Switch } from '@/components/ui/switch';
import { InfoIcon } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-card-foreground">Create Masks</label>
            <div className="group relative">
              <InfoIcon className="w-4 h-4 text-muted-foreground" />
              <div className="absolute left-0 bottom-6 w-64 p-2 bg-popover text-popover-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                When enabled, uses AI to detect and focus on the main subject. Recommended for training specific subjects or people.
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Use AI to focus on the main subject</p>
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
            <label className="block text-sm font-medium text-card-foreground">Style Training</label>
            <div className="group relative">
              <InfoIcon className="w-4 h-4 text-muted-foreground" />
              <div className="absolute left-0 bottom-6 w-64 p-2 bg-popover text-popover-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                Choose this when training an art style or visual effect, rather than a specific subject.
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Train for style instead of subject</p>
        </div>
        <Switch
          checked={isStyle}
          onCheckedChange={onStyleChange}
        />
      </div>
    </div>
  );
};
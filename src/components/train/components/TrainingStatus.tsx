import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

export interface TrainingProgress {
  step: number;
  totalSteps: number;
  status: string;
  error?: string;
}

interface TrainingStatusProps {
  isVisible: boolean;
  progress: TrainingProgress | null;
}

export function TrainingStatus({ isVisible, progress }: TrainingStatusProps) {
  const themeParams = useTelegramTheme();

  if (!isVisible || !progress) return null;

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const progressBarStyle = {
    backgroundColor: progress.error ? '#FF3B30' : themeParams.button_color,
  };

  const percentage = Math.min(100, Math.max(0, (progress.step / progress.totalSteps) * 100));

  return (
    <Card className="p-4 mt-4" style={cardStyle}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {progress.error ? (
              <div className="flex items-center text-red-500 gap-2">
                <AlertCircle className="h-4 w-4" />
                Error
              </div>
            ) : (
              progress.status
            )}
          </div>
          <div className="text-sm">{Math.round(percentage)}%</div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              ...progressBarStyle,
              width: `${percentage}%` 
            }}
          />
        </div>

        {progress.error ? (
          <div className="text-sm text-red-500">{progress.error}</div>
        ) : percentage < 100 ? (
          <div className="flex items-center justify-center text-sm gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing
          </div>
        ) : (
          <div className="text-sm text-center text-green-500">
            Training Complete!
          </div>
        )}
      </div>
    </Card>
  );
}
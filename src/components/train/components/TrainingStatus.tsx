import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
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
    backgroundColor: progress.error ? '#FF3B30' : 
                    progress.step >= progress.totalSteps ? '#34C759' : 
                    themeParams.button_color,
  };

  const percentage = Math.min(100, Math.max(0, (progress.step / progress.totalSteps) * 100));
  const isComplete = percentage >= 100 && !progress.error;

  return (
    <Card className="p-4 mt-4" style={cardStyle}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm font-medium gap-2">
            {progress.error ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Error</span>
              </>
            ) : isComplete ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Complete</span>
              </>
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
          <div className="text-sm text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {progress.error}
          </div>
        ) : isComplete ? (
          <div className="text-sm text-green-500 text-center flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Training Complete!
          </div>
        ) : (
          <div className="flex items-center justify-center text-sm gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing
          </div>
        )}
      </div>
    </Card>
  );
}
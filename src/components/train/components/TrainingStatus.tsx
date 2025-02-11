import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    backgroundColor: themeParams.button_color,
  };

  const percentage = (progress.step / progress.totalSteps) * 100;

  // If there's an error, show it in an Alert
  if (progress.error) {
    return (
      <Alert variant="destructive" style={{
        backgroundColor: '#FF3B3020',
        color: '#FF3B30',
        borderColor: '#FF3B3040'
      }}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{progress.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-4 mt-4" style={cardStyle}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{progress.status}</div>
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

        <div className="flex items-center justify-center text-sm gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </div>
      </div>
    </Card>
  );
}

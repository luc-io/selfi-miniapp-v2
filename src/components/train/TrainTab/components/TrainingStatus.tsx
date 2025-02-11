import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
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
    backgroundColor: themeParams.button_color,
  };

  const percentage = (progress.step / progress.totalSteps) * 100;

  return (
    <Card className="p-4 mt-4" style={cardStyle}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{progress.status}</div>
          <div className="text-sm">{progress.step}/{progress.totalSteps}</div>
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

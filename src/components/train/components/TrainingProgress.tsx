import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Ban } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TrainingProgress as TrainingProgressType } from '@/lib/api';

interface TrainingProgressProps {
  progress: TrainingProgressType;
  onCancel: () => void;
  isLoadingCancel: boolean;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  progress,
  onCancel,
  isLoadingCancel
}) => {
  const getStatusColor = () => {
    switch (progress.status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const canCancel = progress.status.toLowerCase() === 'training' || 
                    progress.status.toLowerCase() === 'processing';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {progress.status.toLowerCase() === 'training' && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          )}
          <span className="font-medium">
            {progress.status === 'training' ? 'Training in Progress' : progress.status}
          </span>
        </div>
        {canCancel && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onCancel}
            disabled={isLoadingCancel}
            className="flex items-center space-x-1"
          >
            {isLoadingCancel ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
            <span>Cancel</span>
          </Button>
        )}
      </div>

      <Progress 
        value={progress.progress} 
        className={getStatusColor()}
      />

      <div className="text-sm text-muted-foreground">
        {progress.message && (
          <p>{progress.message}</p>
        )}
        {progress.estimatedTimeRemaining && progress.status.toLowerCase() === 'training' && (
          <p>Estimated time remaining: {formatTimeRemaining(progress.estimatedTimeRemaining)}</p>
        )}
      </div>

      {progress.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{progress.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

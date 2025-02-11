import { useState, useEffect, useCallback } from 'react';
import { getTrainingStatus } from '@/lib/api';

export interface TrainingProgress {
  step: number;
  totalSteps: number;
  status: string;
  error?: string;
}

interface TrainingStatusHook {
  progress: TrainingProgress | null;
  isTraining: boolean;
  startTraining: (trainingId: string) => void;
  finishTraining: () => void;
  updateProgress: (data: Partial<TrainingProgress>) => void;
  setError: (error: string) => void;
}

const POLLING_INTERVAL = 3000; // Poll every 3 seconds

export function useTrainingStatus(): TrainingStatusHook {
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [currentTrainingId, setCurrentTrainingId] = useState<string | null>(null);

  // Clear progress when training finishes
  useEffect(() => {
    if (!isTraining) {
      const timer = setTimeout(() => {
        setProgress(null);
        setCurrentTrainingId(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isTraining]);

  // Set up polling for training status
  useEffect(() => {
    let pollTimer: NodeJS.Timeout;

    const pollStatus = async () => {
      if (!currentTrainingId || !isTraining) return;

      try {
        const status = await getTrainingStatus(currentTrainingId);

        if (status) {
          // If we have FAL progress info
          if (status.progress) {
            setProgress({
              step: status.progress.progress,
              totalSteps: 100,
              status: status.progress.message || 'Training in progress...'
            });

            // Handle completion states from FAL
            if (status.progress.status === 'completed') {
              setProgress(prev => prev ? {
                ...prev,
                step: 100,
                status: 'Training completed!'
              } : null);
              setIsTraining(false);
            } else if (status.progress.status === 'failed') {
              setError('Training failed: ' + (status.error || 'Unknown error'));
              setIsTraining(false);
            }
          } 
          // Handle status from training record
          else if (status.trainingStatus === 'COMPLETED') {
            setProgress(prev => prev ? {
              ...prev,
              step: 100,
              status: 'Training completed!'
            } : null);
            setIsTraining(false);
          } else if (status.trainingStatus === 'FAILED') {
            setError('Training failed: ' + (status.error || 'Unknown error'));
            setIsTraining(false);
          }
        }
      } catch (error) {
        console.error('Failed to poll training status:', error);
        if (error instanceof Error) {
          setError('Failed to get training status: ' + error.message);
        }
      }

      // Continue polling if still training
      if (isTraining) {
        pollTimer = setTimeout(pollStatus, POLLING_INTERVAL);
      }
    };

    if (currentTrainingId && isTraining) {
      pollTimer = setTimeout(pollStatus, POLLING_INTERVAL);
    }

    return () => {
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
    };
  }, [currentTrainingId, isTraining]);

  const startTraining = useCallback((trainingId: string) => {
    setIsTraining(true);
    setCurrentTrainingId(trainingId);
    setProgress({
      step: 0,
      totalSteps: 100,
      status: 'Initializing training...'
    });
  }, []);

  const finishTraining = useCallback(() => {
    setIsTraining(false);
    if (progress && !progress.error) {
      setProgress(prev => prev ? {
        ...prev,
        step: prev.totalSteps,
        status: 'Training completed!'
      } : null);
    }
  }, [progress]);

  const updateProgress = useCallback((data: Partial<TrainingProgress>) => {
    setProgress(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const setError = useCallback((error: string) => {
    setProgress(prev => prev ? { ...prev, error } : null);
    setIsTraining(false);
  }, []);

  return {
    progress,
    isTraining,
    startTraining,
    finishTraining,
    updateProgress,
    setError
  };
}
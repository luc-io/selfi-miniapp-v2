import { useState, useEffect, useCallback } from 'react';
import type { TrainingProgress } from '../components/TrainingStatus';

interface TrainingStatusHook {
  progress: TrainingProgress | null;
  isTraining: boolean;
  startTraining: () => void;
  finishTraining: () => void;
  updateProgress: (data: Partial<TrainingProgress>) => void;
  setError: (error: string) => void;
}

export function useTrainingStatus(): TrainingStatusHook {
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  // Clear progress when training finishes
  useEffect(() => {
    if (!isTraining) {
      const timer = setTimeout(() => {
        setProgress(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isTraining]);

  const startTraining = useCallback(() => {
    setIsTraining(true);
    setProgress({
      step: 0,
      totalSteps: 100, // Default value, should be updated with actual total
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

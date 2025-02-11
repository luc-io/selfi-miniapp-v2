import { useState, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useTrainingStatus(): TrainingStatusHook {
  const [isTraining, setIsTraining] = useState(false);
  const queryClient = useQueryClient();
  const trainingIdRef = useRef<string | null>(null);

  // Use react-query for polling
  const { data: progress } = useQuery({
    queryKey: ['training', 'status', trainingIdRef.current],
    queryFn: async () => {
      if (!trainingIdRef.current || !isTraining) return null;

      try {
        const status = await getTrainingStatus(trainingIdRef.current);
        console.log('Training status:', status);

        if (!status) return null;

        // Create progress object based on status
        const updatedProgress = {
          step: status.progress?.progress ?? 0,
          totalSteps: 100,
          status: status.progress?.message || 'Training in progress...'
        };

        // Handle completion states
        if (status.progress?.status === 'completed' || status.trainingStatus === 'COMPLETED') {
          const finalProgress = {
            ...updatedProgress,
            step: 100,
            status: 'Training completed!'
          };
          setTimeout(() => {
            setIsTraining(false);
            // Also invalidate models list to show updated status
            queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
          }, 1000);
          return finalProgress;
        }
        
        // Handle failure states
        if (status.progress?.status === 'failed' || status.trainingStatus === 'FAILED') {
          const errorMessage = status.error || status.progress?.message || 'Unknown error';
          if (!errorMessage.includes('Could not find training record')) {
            const errorProgress = {
              ...updatedProgress,
              error: `Training failed: ${errorMessage}`
            };
            setTimeout(() => {
              setIsTraining(false);
              // Also invalidate models list to show updated status
              queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
            }, 1000);
            return errorProgress;
          }
        }

        return updatedProgress;
      } catch (error) {
        console.error('Failed to poll training status:', error);
        if (typeof error === 'string' && error.includes('Could not find training record')) {
          return null;
        }
        return {
          step: 0,
          totalSteps: 100,
          status: 'Error checking status',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    },
    refetchInterval: isTraining ? 3000 : false, // Poll every 3 seconds while training
    enabled: Boolean(trainingIdRef.current && isTraining)
  });

  const startTraining = useCallback((trainingId: string) => {
    console.log('Starting training with ID:', trainingId);
    trainingIdRef.current = trainingId;
    setIsTraining(true);
  }, []);

  const finishTraining = useCallback(() => {
    if (progress && !progress.error) {
      queryClient.setQueryData(['training', 'status', trainingIdRef.current], {
        ...progress,
        step: progress.totalSteps,
        status: 'Training completed!'
      });
    }
    setTimeout(() => {
      setIsTraining(false);
      trainingIdRef.current = null;
      // Invalidate models list to show updated status
      queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
    }, 1000);
  }, [progress, queryClient]);

  const updateProgress = useCallback((data: Partial<TrainingProgress>) => {
    queryClient.setQueryData(['training', 'status', trainingIdRef.current], 
      (prev: TrainingProgress | null) => prev ? { ...prev, ...data } : null
    );
  }, [queryClient]);

  const setError = useCallback((error: string) => {
    if (error.includes('Could not find training record')) {
      return;
    }
    console.log('Training error:', error);
    queryClient.setQueryData(['training', 'status', trainingIdRef.current],
      (prev: TrainingProgress | null) => prev ? { ...prev, error } : null
    );
    setTimeout(() => {
      setIsTraining(false);
      trainingIdRef.current = null;
      // Invalidate models list to show error status
      queryClient.invalidateQueries({ queryKey: ['models', 'user'] });
    }, 1000);
  }, [queryClient]);

  return {
    progress: progress ?? null,
    isTraining,
    startTraining,
    finishTraining,
    updateProgress,
    setError
  };
}
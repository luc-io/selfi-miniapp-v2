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

const POLLING_INTERVAL = 3000;   // Poll every 3 seconds
const CLEANUP_DELAY = 5000;     // Clear progress after 5 seconds (increased from 3s)
const MAX_RETRIES = 3;         // Maximum number of consecutive polling failures

export function useTrainingStatus(): TrainingStatusHook {
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [currentTrainingId, setCurrentTrainingId] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Clear progress when training finishes successfully
  useEffect(() => {
    if (!isTraining && progress && !progress.error && progress.step >= progress.totalSteps) {
      const timer = setTimeout(() => {
        setProgress(null);
        setCurrentTrainingId(null);
        setFailedAttempts(0);
      }, CLEANUP_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isTraining, progress]);

  // Set up polling for training status
  useEffect(() => {
    let pollTimer: NodeJS.Timeout;

    const pollStatus = async () => {
      if (!currentTrainingId || !isTraining) return;

      try {
        const status = await getTrainingStatus(currentTrainingId);
        console.log('Training status poll:', status); // Debug log

        // Reset failed attempts on successful poll
        setFailedAttempts(0);

        if (status) {
          // If we have FAL progress info
          if (status.progress) {
            const updatedProgress = {
              step: status.progress.progress,
              totalSteps: 100,
              status: status.progress.message || 'Training in progress...'
            };

            // Update progress before checking completion state
            setProgress(updatedProgress);

            // Handle completion states from FAL or training record
            if (status.progress.status === 'completed' || status.trainingStatus === 'COMPLETED') {
              // Set final state but don't immediately clear isTraining
              setProgress(prev => ({
                ...prev!,
                step: 100,
                status: 'Training completed!'
              }));
              // Delay setting isTraining to false
              setTimeout(() => setIsTraining(false), 1000);
            } else if (status.progress.status === 'failed' || status.trainingStatus === 'FAILED') {
              const errorMessage = status.error || status.progress.message || 'Unknown error';
              if (!errorMessage.includes('Could not find training record')) {
                setError('Training failed: ' + errorMessage);
              }
            }
          } 
          // Handle status from training record without FAL progress
          else if (status.trainingStatus === 'COMPLETED') {
            setProgress(prev => ({
              ...prev!,
              step: 100,
              status: 'Training completed!'
            }));
            setTimeout(() => setIsTraining(false), 1000);
          } else if (status.trainingStatus === 'FAILED') {
            if (!status.error?.includes('Could not find training record')) {
              setError('Training failed: ' + (status.error || 'Unknown error'));
            }
          }
        }
      } catch (error) {
        console.error('Failed to poll training status:', error);
        
        if (typeof error === 'string' && error.includes('Could not find training record')) {
          return; // Ignore this specific error
        }
        
        // Increment failed attempts
        setFailedAttempts(prev => {
          const newCount = prev + 1;
          
          // If too many consecutive failures, stop polling
          if (newCount >= MAX_RETRIES) {
            setError('Failed to get training status: Too many failed attempts');
            setIsTraining(false);
            return 0;
          }
          return newCount;
        });
      }

      // Continue polling if still training and within retry limits
      if (isTraining && failedAttempts < MAX_RETRIES) {
        pollTimer = setTimeout(pollStatus, POLLING_INTERVAL);
      }
    };

    if (currentTrainingId && isTraining) {
      // Start polling immediately
      pollStatus();
    }

    return () => {
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
    };
  }, [currentTrainingId, isTraining, failedAttempts]);

  const startTraining = useCallback((trainingId: string) => {
    setIsTraining(true);
    setCurrentTrainingId(trainingId);
    setFailedAttempts(0);
    setProgress({
      step: 0,
      totalSteps: 100,
      status: 'Initializing training...'
    });
  }, []);

  const finishTraining = useCallback(() => {
    if (progress && !progress.error) {
      setProgress(prev => ({
        ...prev!,
        step: prev!.totalSteps,
        status: 'Training completed!'
      }));
    }
    // Delay setting isTraining to false
    setTimeout(() => setIsTraining(false), 1000);
  }, [progress]);

  const updateProgress = useCallback((data: Partial<TrainingProgress>) => {
    setProgress(prev => prev ? { ...prev, ...data } : null);
  }, []);

  const setError = useCallback((error: string) => {
    // Don't set error state for "Could not find training record"
    if (error.includes('Could not find training record')) {
      return;
    }
    console.log('Training error:', error);
    setProgress(prev => prev ? { ...prev, error } : null);
    setTimeout(() => setIsTraining(false), 1000);
    setFailedAttempts(0);
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
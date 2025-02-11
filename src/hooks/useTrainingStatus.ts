import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserModels } from '@/lib/api/loras';
import type { LoraStatus, Model } from '@/types/model';

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

const STATUS_MESSAGES: Record<LoraStatus, string> = {
  PENDING: 'Initializing training...',
  TRAINING: 'Training in progress...',
  COMPLETED: 'Training completed!',
  FAILED: 'Training failed'
};

export function useTrainingStatus(): TrainingStatusHook {
  const [isTraining, setIsTraining] = useState(false);
  const [currentLoraId, setCurrentLoraId] = useState<string | null>(null);

  // Use the models query to get status
  const { data: models = [] } = useQuery<Model[]>({
    queryKey: ['models', 'user'],
    queryFn: getUserModels,
    refetchInterval: isTraining ? 3000 : false
  });

  // Find current model status
  const currentModel = currentLoraId ? models.find(m => m.databaseId === currentLoraId) : null;
  
  // Convert model status to progress
  const progress = currentModel ? {
    step: currentModel.status === 'COMPLETED' ? 100 : 
          currentModel.status === 'FAILED' ? 0 : 50,
    totalSteps: 100,
    status: STATUS_MESSAGES[currentModel.status as LoraStatus],
    ...(currentModel.status === 'FAILED' && { error: 'Training failed' })
  } : null;

  const startTraining = useCallback((trainingId: string) => {
    console.log('Starting training with training ID:', trainingId);
    // Try to find the corresponding model
    const model = models.find(m => m.training?.databaseId === trainingId);
    if (model) {
      setCurrentLoraId(model.databaseId);
      setIsTraining(true);
    } else {
      console.error('Could not find model for training ID:', trainingId);
    }
  }, [models]);

  const finishTraining = useCallback(() => {
    setIsTraining(false);
    setCurrentLoraId(null);
  }, []);

  const updateProgress = useCallback((data: Partial<TrainingProgress>) => {
    // No need to manually update progress anymore
    console.log('Progress update:', data);
  }, []);

  const setError = useCallback((error: string) => {
    console.log('Training error:', error);
    setIsTraining(false);
    setCurrentLoraId(null);
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
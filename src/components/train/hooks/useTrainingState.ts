import { useState, useCallback } from 'react';
import { DEFAULT_STATE, type TrainingImage } from '../types/training';

interface TrainingStateType {
  images: TrainingImage[];
  triggerWord: string;
  steps: number;
  isStyle: boolean;
  createMasks: boolean;
}

export function useTrainingState() {
  const [state, setState] = useState<TrainingStateType>(DEFAULT_STATE);

  const setImages = useCallback((images: TrainingImage[]) => {
    setState((prev: TrainingStateType) => ({ ...prev, images }));
  }, []);

  const setTriggerWord = useCallback((triggerWord: string) => {
    setState((prev: TrainingStateType) => ({ ...prev, triggerWord }));
  }, []);

  const setSteps = useCallback((steps: number) => {
    setState((prev: TrainingStateType) => ({ ...prev, steps }));
  }, []);

  const setStyle = useCallback((isStyle: boolean) => {
    setState((prev: TrainingStateType) => ({ 
      ...prev, 
      isStyle,
      createMasks: isStyle ? false : prev.createMasks
    }));
  }, []);

  const setMasks = useCallback((createMasks: boolean) => {
    setState((prev: TrainingStateType) => ({ ...prev, createMasks }));
  }, []);

  const resetState = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    state,
    setImages,
    setTriggerWord,
    setSteps,
    setStyle,
    setMasks,
    resetState
  };
}
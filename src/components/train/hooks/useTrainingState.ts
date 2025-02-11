import { useState, useCallback } from 'react';

export interface TrainingImage {
  file: File;
  caption: string;
}

export interface TrainingState {
  images: TrainingImage[];
  triggerWord: string;
  steps: number;
  isStyle: boolean;
  createMasks: boolean;
}

export const DEFAULT_STATE: TrainingState = {
  images: [],
  triggerWord: '',
  steps: 100,
  isStyle: false,
  createMasks: false
};

export function useTrainingState() {
  const [state, setState] = useState(DEFAULT_STATE);

  const setImages = useCallback((images: TrainingImage[]) => {
    setState(prev => ({ ...prev, images }));
  }, []);

  const setTriggerWord = useCallback((triggerWord: string) => {
    setState(prev => ({ ...prev, triggerWord }));
  }, []);

  const setSteps = useCallback((steps: number) => {
    setState(prev => ({ ...prev, steps }));
  }, []);

  const setStyle = useCallback((isStyle: boolean) => {
    setState(prev => ({ 
      ...prev, 
      isStyle,
      createMasks: isStyle ? false : prev.createMasks
    }));
  }, []);

  const setMasks = useCallback((createMasks: boolean) => {
    setState(prev => ({ ...prev, createMasks }));
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
import { useState, useCallback } from 'react';
import { DEFAULT_STATE, type TrainingImage } from '../../types/training';

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

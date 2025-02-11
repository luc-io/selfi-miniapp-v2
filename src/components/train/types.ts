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
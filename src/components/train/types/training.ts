export interface TrainingImage {
  file: File;
  caption: string;
}

export interface TrainingState {
  images: TrainingImage[];
  triggerWord: string;
  createMasks: boolean;
  steps: number;
  isStyle: boolean;
}

export const DEFAULT_STATE: TrainingState = {
  images: [],
  triggerWord: '',
  createMasks: false,
  steps: 1000,
  isStyle: true,
};
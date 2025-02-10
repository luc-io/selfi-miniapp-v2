import { TrainingImage } from '../types/training';
import { TrainingProgress as TrainingProgressType } from '@/lib/api';

export interface FileUploadProps {
  totalSize: number;
  maxSize: number;
  onFilesSelected: (newImages: TrainingImage[]) => void;
  disabled?: boolean;
}

export interface ImagePreviewsProps {
  images: TrainingImage[];
  onImageRemove: (index: number) => void;
  onCaptionUpdate: (index: number, caption: string) => void;
  disabled?: boolean;
}

export interface TriggerWordInputProps {
  value: string;
  isStyle: boolean;
  onChange: (triggerWord: string) => void;
  disabled?: boolean;
}

export interface TrainingStepsProps {
  value: number;
  onChange: (steps: number) => void;
  disabled?: boolean;
}

export interface TrainingTogglesProps {
  isStyle: boolean;
  createMasks: boolean;
  onStyleChange: (isStyle: boolean) => void;
  onMasksChange: (createMasks: boolean) => void;
  disabled?: boolean;
}

export interface TrainingProgressProps {
  progress: TrainingProgressType;
  onCancel: () => void;
  isLoadingCancel: boolean;
}
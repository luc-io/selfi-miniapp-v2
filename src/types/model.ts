export type LoraStatus = 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';

export type TrainStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ModelFile {
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

export interface TrainingMetadata {
  config: ModelFile;
  weights: ModelFile;
  test_mode?: boolean;
}

export interface ModelTraining {
  databaseId: string;
  loraId: string;
  userDatabaseId: string;
  baseModelId: string;
  steps: number;
  is_style: boolean;
  create_masks: boolean;
  trigger_word: string;
  imageUrls: string[];
  starsSpent: number;
  status: TrainStatus;
  metadata?: TrainingMetadata;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export interface Model {
  databaseId: string;
  name: string;
  triggerWord: string;
  weightsUrl?: string;
  configUrl?: string;
  baseModelId: string;
  status: LoraStatus;
  previewImageUrl?: string;
  isPublic: boolean;
  starsRequired: number;
  userDatabaseId: string;
  training?: ModelTraining;
  config_file?: ModelFile;
  diffusers_lora_file?: ModelFile;
  createdAt: string;
  updatedAt: string;
}
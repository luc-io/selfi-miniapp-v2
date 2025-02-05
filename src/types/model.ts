export type LoraStatus = 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';

export interface ModelFile {
  url: string;
  file_name: string;
  file_size: number;
  content_type: string;
}

export interface ModelTraining {
  steps: number;
  metadata: Record<string, any>;
}

export interface Model {
  databaseId: string;
  name: string;
  triggerWord: string;
  weightsUrl?: string;
  configUrl?: string;
  isPublic: boolean;
  status: LoraStatus;
  createdAt: string;
  training?: ModelTraining;
  config_file?: ModelFile;
  diffusers_lora_file?: ModelFile;
}
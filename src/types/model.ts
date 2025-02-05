export type LoraStatus = 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';

export interface ModelFile {
  url: string;
  file_name: string;
  file_size: number;
  content_type: string;
}

export interface ModelInput {
  steps: number;
  is_style: boolean;
  create_masks: boolean;
  trigger_word: string;
}

export interface Model {
  id: string;  // Changed from number to string to match Prisma databaseId
  name: string;
  triggerWord: string;
  weightsUrl?: string;
  configUrl?: string;
  isPublic: boolean;
  status: LoraStatus;
  createdAt: string;
  isActive: boolean;
  input: ModelInput;
}
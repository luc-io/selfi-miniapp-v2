export type LoraStatus = 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';

export interface ModelFile {
  url: string;
  file_name: string;
  file_size: number;
  content_type: string;
}

export interface Model {
  id: number;
  name: string;
  triggerWord: string;
  createdAt: Date;
  status: LoraStatus;
  isActive: boolean;
  config_file: ModelFile;
  diffusers_lora_file: ModelFile;
  debug_preprocessed_output?: any;
}
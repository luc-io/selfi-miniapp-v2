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
  id: number;
  name: string;
  createdAt: Date;
  status: LoraStatus;
  isActive: boolean;
  input: ModelInput;
  config_file: ModelFile;
  diffusers_lora_file: ModelFile;
  debug_preprocessed_output?: any;
}
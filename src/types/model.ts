export interface ModelFile {
  url: string;
  file_name: string;
  file_size: number;
  content_type: string;
}

export interface Model {
  id: number;
  name: string;
  createdAt: Date;
  isActive: boolean;
  config_file: ModelFile;
  diffusers_lora_file: ModelFile;
}
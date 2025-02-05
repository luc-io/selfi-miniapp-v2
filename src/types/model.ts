export interface Model {
  id: number;
  name: string;
  createdAt: Date;
  isActive: boolean;
  status: string;
  input: any; // Update this type based on your actual input structure
  config_file: {
    url: string;
    file_name: string;
    file_size: number;
    content_type: string;
  };
  diffusers_lora_file: {
    url: string;
    file_name: string;
    file_size: number;
    content_type: string;
  };
}
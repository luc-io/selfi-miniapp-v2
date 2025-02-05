export interface LoraConfig {
  path: string;
  scale: number;
}

export interface GenerationParameters {
  image_size: string;
  num_inference_steps: number;
  seed: number;
  guidance_scale: number;
  num_images: number;
  sync_mode: boolean;
  enable_safety_checker: boolean;
  output_format: string;
  modelPath: string;
  loras: LoraConfig[];
}
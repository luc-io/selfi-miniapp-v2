import type { LoraParameter } from './lora';

export type ImageSize = 
  | 'landscape_4_3' 
  | 'landscape_16_9' 
  | 'square_hd' 
  | 'square' 
  | 'portrait_4_3' 
  | 'portrait_16_9';

export interface GenerationParameters {
  image_size: ImageSize;
  num_inference_steps: number;
  seed: number;
  guidance_scale: number;
  num_images: number;
  sync_mode: boolean;
  enable_safety_checker: boolean;
  output_format: 'jpeg' | 'png';
  modelPath: string;
  loras?: LoraParameter[];
}
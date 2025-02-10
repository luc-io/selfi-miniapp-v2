import { LoraOption } from './params';

export interface GenerationParameters {
  image_size: {
    width: number;
    height: number;
  };
  num_inference_steps: number;
  seed: number | null;
  guidance_scale: number;
  strength: number;
  negative_prompt: string;
  prompt: string;
  loras?: LoraOption[];
  model_path?: string;
  scheduler?: string;
}

export interface GenerationResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  negativePrompt: string;
  seed: number;
  metadata?: any;
}

export interface UserGenerationParameters {
  params: GenerationParameters;
}
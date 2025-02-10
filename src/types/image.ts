import { GenerationParameters } from './index';
import { LoraParameter } from './lora';

export interface GeneratedImage {
  id: string;
  url: string;
  width: number;
  height: number;
  prompt: string;
  seed: number;
  hasNsfw: boolean;
  createdAt: string;
  params: GenerationParameters;
  loras?: LoraParameter[];
}

export interface ImageResponse {
  seed: number;
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;
  }>;
  prompt: string;
  timings: {
    inference: number;
  };
  has_nsfw_concepts: boolean[];
}
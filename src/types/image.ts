export interface GenerationParams {
  num_inference_steps: number;
  guidance_scale: number;
}

export interface LoraInfo {
  name?: string;
  path?: string;
  triggerWord?: string;
  scale?: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  falSeed: number;
  seed: number;
  width?: number;
  height?: number;
  createdAt: string;
  hasNsfw: boolean;
  params: GenerationParams;
  loras?: LoraInfo[];
}
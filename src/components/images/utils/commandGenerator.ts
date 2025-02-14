import type { GeneratedImage } from '@/types/image';
import type { StoredLora } from '../types';
import { ASPECT_RATIO_MAPPING } from './aspectRatioMap';

export const generateCommand = (image: GeneratedImage): string => {
  const parts = ['/gen', image.prompt];
  
  // Add model parameters
  if (image.params?.num_inference_steps) parts.push(`--s ${image.params.num_inference_steps}`);
  if (image.params?.guidance_scale) parts.push(`--c ${image.params.guidance_scale}`);
  if (typeof image.seed === 'number' && !isNaN(image.seed)) {
    parts.push(`--seed ${image.seed}`);
  }

  // Add aspect ratio if available
  if (image.params?.image_size) {
    const aspectRatio = ASPECT_RATIO_MAPPING[image.params.image_size];
    if (aspectRatio) {
      parts.push(`--ar ${aspectRatio}`);
    }
  }

  // Add all LoRAs with their trigger words and scales
  // Use nullish coalescing to handle potential undefined values
  const loras = (image.params?.loras ?? []) as StoredLora[];
  loras.forEach(lora => {
    if (lora.triggerWord && lora.scale) {
      parts.push(`--l ${lora.triggerWord}:${lora.scale}`);
    }
  });
  
  return parts.join(' ');
};
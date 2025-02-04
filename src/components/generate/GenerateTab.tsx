import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { useGenerate } from '@/hooks/useGenerate';
import { ModelSelector } from './ModelSelector';
import { LoraSelector } from './LoraSelector';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Loader2 } from 'lucide-react';
import type { GenerationParameters, ImageSize } from '@/types';
import type { LoraModel, LoraParameter } from '@/types/lora';
import { getUserParameters, saveUserParameters } from '@/api/parameters';
import { getAvailableLoras } from '@/api/loras';

const IMAGE_SIZES = {
  landscape_4_3: 'Landscape 4:3',
  landscape_16_9: 'Landscape 16:9',
  square_hd: 'Square HD',
  square: 'Square',
  portrait_4_3: 'Portrait 4:3',
  portrait_16_9: 'Portrait 16:9',
} as const;

const DEFAULT_PARAMS: GenerationParameters = {
  image_size: 'landscape_4_3',
  num_inference_steps: 28,
  seed: Math.floor(Math.random() * 1000000),
  guidance_scale: 3.5,
  num_images: 1,
  sync_mode: false,
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function GenerateTab() {
  const generate = useGenerate();
  const [params, setParams] = useState<GenerationParameters | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLoras, setAvailableLoras] = useState<LoraModel[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [savedParams, loras] = await Promise.all([
          getUserParameters(),
          getAvailableLoras()
        ]);
        
        setParams(savedParams?.params || DEFAULT_PARAMS);
        setAvailableLoras(loras);
      } catch (error) {
        console.error('Error loading data:', error);
        setParams(DEFAULT_PARAMS);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading || !params) {
    return (
      <Card className="bg-white rounded-lg shadow-md">
        <div className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Card>
    );
  }

  // Rest of your component code...
  return <div>Loading...</div>;
}
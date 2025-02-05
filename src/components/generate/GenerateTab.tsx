import { useParameters } from '@/hooks/useParameters';
import { useGenerate } from '@/hooks/useGenerate';
import { LoadingSpinner } from '../LoadingSpinner';
import { ModelSelector } from './ModelSelector';
import { LoraSelector } from './LoraSelector';
import { AdvancedOptions } from './AdvancedOptions';
import type { GenerationParameters } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const defaultParameters: GenerationParameters = {
  image_size: 'portrait_16_9',
  num_inference_steps: 48,
  seed: 334370,
  guidance_scale: 20,
  num_images: 1,
  sync_mode: false,
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function GenerateTab() {
  const { parameters, setParameters } = useParameters();
  const { generateImage, isPending } = useGenerate();
  
  if (!parameters) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const activeParams = parameters || defaultParameters;

  const handleGenerate = () => {
    generateImage(activeParams);
  };

  const updateParameters = (updates: Partial<GenerationParameters>) => {
    setParameters({ ...activeParams, ...updates });
  };

  return (
    <div className="p-4 space-y-6 bg-background">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Generate Image</CardTitle>
          <CardDescription>Configure your image generation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt" className="text-sm font-medium">Prompt</Label>
            <Input
              id="prompt"
              placeholder="Enter your image prompt..."
              className="mt-1 bg-muted"
            />
          </div>

          <div>
            <Label htmlFor="negative-prompt" className="text-sm font-medium">Negative Prompt</Label>
            <Input
              id="negative-prompt"
              placeholder="Enter negative prompts..."
              className="mt-1 bg-muted"
            />
          </div>

          <ModelSelector
            value={activeParams.modelPath}
            onChange={(value) => updateParameters({ modelPath: value })}
          />

          <LoraSelector
            loras={activeParams.loras}
            onChange={(loras) => updateParameters({ loras })}
          />

          <AdvancedOptions
            parameters={activeParams}
            onChange={(params) => updateParameters(params)}
          />

          <Button 
            onClick={handleGenerate}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? 'Generating...' : 'Generate Image'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
import { useParameters } from '@/hooks/useParameters';
import { useGenerate } from '@/hooks/useGenerate';
import { LoadingSpinner } from './LoadingSpinner';
import type { GenerationParameters } from '@/types';

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

export function Generate() {
  const { parameters, isLoading } = useParameters();
  const { mutate: generateImage, isLoading: isGenerating } = useGenerate();
  
  // If we're loading parameters, show spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Use saved parameters if available, otherwise use defaults
  const activeParams = parameters || defaultParameters;

  const handleGenerate = () => {
    generateImage(activeParams);
  };

  return (
    <div className="space-y-4">
      {/* Your form fields here using activeParams for values */}
      <button 
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full px-4 py-2 text-white bg-primary rounded-md disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
}
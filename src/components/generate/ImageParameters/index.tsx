import type { GenerationParameters } from '@/types';
import type { TelegramTheme } from '@/types';
import { SeedInput } from './SeedInput';
import { StepsInput } from './StepsInput';
import { GuidanceInput } from './GuidanceInput';
import { NumImagesInput } from './NumImagesInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const IMAGE_SIZES = {
  landscape_4_3: 'Landscape 4:3',
  landscape_16_9: 'Landscape 16:9',
  square_hd: 'Square HD',
  square: 'Square',
  portrait_4_3: 'Portrait 4:3',
  portrait_16_9: 'Portrait 16:9',
} as const;

interface ImageParametersProps {
  params: GenerationParameters;
  updateParam: <K extends keyof GenerationParameters>(key: K, value: GenerationParameters[K]) => void;
  themeParams: TelegramTheme;
}

const DEFAULT_PARAMS: GenerationParameters = {
  image_size: 'landscape_4_3',
  num_inference_steps: 28,
  seed: 0,
  guidance_scale: 3.5,
  num_images: 1,
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function ImageParameters({ params, updateParam, themeParams }: ImageParametersProps) {
  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold" style={labelStyle}>Image Parameters</h2>
      
      {/* Seed Input */}
      <SeedInput
        value={params.seed}
        onChange={(value) => updateParam('seed', value)}
        themeParams={themeParams}
      />

      {/* Steps Input */}
      <StepsInput
        value={params.num_inference_steps}
        onChange={(value) => updateParam('num_inference_steps', value)}
        onReset={() => updateParam('num_inference_steps', DEFAULT_PARAMS.num_inference_steps)}
        themeParams={themeParams}
      />

      {/* Guidance Scale Input */}
      <GuidanceInput
        value={params.guidance_scale}
        onChange={(value) => updateParam('guidance_scale', value)}
        onReset={() => updateParam('guidance_scale', DEFAULT_PARAMS.guidance_scale)}
        themeParams={themeParams}
      />

      {/* Number of Images Input */}
      <NumImagesInput
        value={params.num_images}
        onChange={(value) => updateParam('num_images', value)}
        onReset={() => updateParam('num_images', DEFAULT_PARAMS.num_images)}
        themeParams={themeParams}
      />

      {/* Image Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={labelStyle}>Image Size</label>
        <Select 
          value={params.image_size} 
          onValueChange={(v: string) => updateParam('image_size', v as keyof typeof IMAGE_SIZES)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(IMAGE_SIZES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Output Format */}
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={labelStyle}>Output Format</label>
        <Select 
          value={params.output_format}
          onValueChange={(v: string) => updateParam('output_format', v as 'jpeg' | 'png')}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Safety Checker */}
      <div className="flex items-center justify-between py-2">
        <div>
          <label className="block text-sm font-medium" style={labelStyle}>Safety Checker</label>
          <p className="text-sm" style={hintStyle}>Filter inappropriate content</p>
        </div>
        <Switch 
          checked={params.enable_safety_checker}
          onCheckedChange={(checked: boolean) => updateParam('enable_safety_checker', checked)}
        />
      </div>
    </div>
  );
}
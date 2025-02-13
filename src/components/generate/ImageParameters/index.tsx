import type { GenerationParameters } from '@/types';
import type { TelegramThemeParams } from '@/types/telegram';
import { SeedInput } from './SeedInput';
import { StepsInput } from './StepsInput';
import { GuidanceInput } from './GuidanceInput';
import { NumImagesInput } from './NumImagesInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateFalSeed } from '@/utils/seed';

const IMAGE_SIZES = {
  landscape_4_3: 'Paisaje 4:3',
  landscape_16_9: 'Paisaje 16:9',
  square_hd: 'Cuadrado 1:1 HD',
  square: 'Cuadrado 1:1',
  portrait_4_3: 'Retrato 4:3',
  portrait_16_9: 'Retrato 16:9',
} as const;

interface ImageParametersProps {
  params: GenerationParameters;
  updateParam: <K extends keyof GenerationParameters>(key: K, value: GenerationParameters[K]) => void;
  themeParams: TelegramThemeParams;
}

const DEFAULT_PARAMS: GenerationParameters = {
  image_size: 'landscape_4_3',
  num_inference_steps: 28,
  seed: generateFalSeed(),
  guidance_scale: 3.5,
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function ImageParameters({ params, updateParam, themeParams }: ImageParametersProps) {
  return (
    <div className="space-y-6">
      {/* Seed Input */}
      <SeedInput
        value={params.seed}
        onChange={(value) => updateParam('seed', value)}
        themeParams={themeParams}
      />

      {/* Image Size */}
      <div className="space-y-2">
        <label 
          className="block text-sm font-medium" 
          style={{ color: themeParams.text_color }}
        >
          Image Size
        </label>
        <Select 
          value={params.image_size} 
          onValueChange={(v: string) => updateParam('image_size', v as keyof typeof IMAGE_SIZES)}
        >
          <SelectTrigger 
            className="w-full"
            style={{
              backgroundColor: themeParams.secondary_bg_color,
              color: themeParams.text_color,
              borderColor: `${themeParams.button_color}0A`
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{
              backgroundColor: themeParams.bg_color,
              color: themeParams.text_color,
              borderColor: `${themeParams.button_color}0A`
            }}
          >
            {Object.entries(IMAGE_SIZES).map(([value, label]) => (
              <SelectItem 
                key={value} 
                value={value}
                style={{
                  backgroundColor: 'transparent',
                  color: themeParams.text_color,
                  '--highlight-bg': `${themeParams.button_color}0A`
                } as React.CSSProperties}
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
        onReset={() => updateParam('num_images', 1)}
        themeParams={themeParams}
      />

      {/* Output Format */}
      <div className="space-y-2">
        <label 
          className="block text-sm font-medium" 
          style={{ color: themeParams.text_color }}
        >
          Output Format
        </label>
        <Select 
          value={params.output_format}
          onValueChange={(v: string) => updateParam('output_format', v as 'jpeg' | 'png')}
        >
          <SelectTrigger 
            className="w-full"
            style={{
              backgroundColor: themeParams.secondary_bg_color,
              color: themeParams.text_color,
              borderColor: `${themeParams.button_color}0A`
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{
              backgroundColor: themeParams.bg_color,
              color: themeParams.text_color,
              borderColor: `${themeParams.button_color}0A`
            }}
          >
            <SelectItem 
              value="jpeg"
              style={{
                backgroundColor: 'transparent',
                color: themeParams.text_color,
                '--highlight-bg': `${themeParams.button_color}0A`
              } as React.CSSProperties}
            >
              JPEG
            </SelectItem>
            <SelectItem 
              value="png"
              style={{
                backgroundColor: 'transparent',
                color: themeParams.text_color,
                '--highlight-bg': `${themeParams.button_color}0A`
              } as React.CSSProperties}
            >
              PNG
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Safety Checker */}
      <div className="flex items-center justify-between py-2">
        <div>
          <label 
            className="block text-sm font-medium" 
            style={{ color: themeParams.text_color }}
          >
            Safety Checker
          </label>
          <p 
            className="text-sm" 
            style={{ color: themeParams.hint_color }}
          >
            Filter inappropriate content
          </p>
        </div>
        <Switch 
          checked={params.enable_safety_checker}
          onCheckedChange={(checked: boolean) => updateParam('enable_safety_checker', checked)}
          style={{
            backgroundColor: params.enable_safety_checker ? themeParams.button_color : `${themeParams.button_color}0A`,
            borderColor: themeParams.button_color
          }}
        />
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { useGenerate } from '@/hooks/useGenerate';
import { useParameters } from '@/hooks/useParameters';
import { ModelSelector } from './ModelSelector';
import { LoraSelector } from './LoraSelector';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Loader2 } from 'lucide-react';
import type { GenerationParameters, ImageSize } from '@/types';
import type { LoraModel, LoraParameter } from '@/types/lora';
import { saveUserParameters } from '@/api/parameters';
import { getAvailableLoras } from '@/api/loras';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

const IMAGE_SIZES = {
  landscape_4_3: 'Landscape 4:3',
  landscape_16_9: 'Landscape 16:9',
  square_hd: 'Square HD',
  square: 'Square',
  portrait_4_3: 'Portrait 4:3',
  portrait_16_9: 'Portrait 16:9',
} as const;

// Default parameters matching the useParameters hook
const defaultParams: GenerationParameters = {
  image_size: 'landscape_4_3',
  num_inference_steps: 28,
  seed: Math.floor(Math.random() * 1000000),
  guidance_scale: 3.5,
  num_images: 1,
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function GenerateTab() {
  const { isPending } = useGenerate();
  const { parameters, isLoading: isLoadingParams, invalidateParameters } = useParameters();
  // Initialize with defaultParams
  const [params, setParams] = useState<GenerationParameters>(defaultParams);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLoras, setAvailableLoras] = useState<LoraModel[]>([]);
  const themeParams = useTelegramTheme();

  // Update local state when parameters load
  useEffect(() => {
    if (parameters) {
      setParams(parameters);
    }
  }, [parameters]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const loras = await getAvailableLoras();
        setAvailableLoras(loras);
      } catch (error) {
        console.error('Error loading loras:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const updateParam = <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ): void => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value
    }));
  };

  const handleAddLora = (lora: LoraParameter) => {
    setParams((prevParams) => ({
      ...prevParams,
      loras: [...(prevParams.loras || []), lora]
    }));
  };

  const handleRemoveLora = (index: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      loras: prevParams.loras?.filter((_, i) => i !== index) || []
    }));
  };

  const handleLoraScaleChange = (index: number, scale: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      loras: prevParams.loras?.map((lora, i) =>
        i === index ? { ...lora, scale } : lora
      ) || []
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveUserParameters(params);
      await invalidateParameters(); // Refresh the parameters in cache
      
      window.Telegram?.WebApp?.sendData(JSON.stringify({
        action: 'save_params',
        params
      }));
      window.Telegram?.WebApp?.close();
    } catch (error) {
      console.error('Error saving parameters:', error);
      window.Telegram?.WebApp?.showPopup({
        message: 'Failed to save parameters. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const buttonStyle = {
    backgroundColor: themeParams.button_color,
    color: themeParams.button_text_color,
  };

  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  if (isLoading || isLoadingParams) {
    return (
      <Card className="shadow-md" style={cardStyle}>
        <div className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: themeParams.button_color }} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-md" style={cardStyle}>
      <div className="p-6 space-y-8">
        <ModelSelector 
          onSelect={(modelPath: string) => updateParam('modelPath', modelPath)}
          defaultValue={params.modelPath}
        />

        {/* LoRA Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" style={labelStyle}>LoRA Models</h2>
          <LoraSelector
            loras={params.loras || []}
            availableLoras={availableLoras.map(lora => ({
              path: lora.databaseId,
              name: lora.name,
              triggerWord: lora.triggerWord
            }))}
            onAdd={handleAddLora}
            onRemove={handleRemoveLora}
            onScaleChange={handleLoraScaleChange}
          />
        </div>

        {/* Image Parameters */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold" style={labelStyle}>Image Parameters</h2>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={labelStyle}>Image Size</label>
            <Select 
              value={params.image_size} 
              onValueChange={(v: string) => updateParam('image_size', v as ImageSize)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={IMAGE_SIZES[params.image_size]} />
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

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={labelStyle}>
              Steps <span style={hintStyle} className="ml-1">({params.num_inference_steps})</span>
            </label>
            <Slider 
              value={[params.num_inference_steps]}
              onValueChange={(v: number[]) => updateParam('num_inference_steps', v[0])}
              min={1}
              max={50}
              step={1}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={labelStyle}>
              Guidance Scale <span style={hintStyle} className="ml-1">({params.guidance_scale})</span>
            </label>
            <Slider 
              value={[params.guidance_scale]}
              onValueChange={(v: number[]) => updateParam('guidance_scale', v[0])}
              min={1}
              max={20}
              step={0.1}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={labelStyle}>
              Number of Images <span style={hintStyle} className="ml-1">({params.num_images})</span>
            </label>
            <Slider 
              value={[params.num_images]}
              onValueChange={(v: number[]) => updateParam('num_images', v[0])}
              min={1}
              max={4}
              step={1}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={labelStyle}>Output Format</label>
            <Select 
              value={params.output_format}
              onValueChange={(v: string) => updateParam('output_format', v as 'jpeg' | 'png')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={params.output_format.toUpperCase()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

        {/* Save Button */}
        <button
          className="w-full py-3 px-4 text-sm font-semibold shadow-sm hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending || isSaving}
          onClick={handleSave}
          style={buttonStyle}
        >
          {isSaving ? 'Saving...' : 'Save Parameters'}
        </button>
      </div>
    </Card>
  );
}
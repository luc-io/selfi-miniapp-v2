import { useEffect, useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { useGenerate } from '@/hooks/useGenerate';
import { useParameters } from '@/hooks/useParameters';
import { ModelSelector } from './ModelSelector';
import { LoraSelector } from './LoraSelector';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Loader2, RotateCcw } from 'lucide-react';
import type { GenerationParameters, ImageSize } from '@/types';
import type { LoraModel, LoraParameter } from '@/types/lora';
import { saveUserParameters } from '@/api/parameters';
import { getUserModels } from '@/api/loras';
import { useQuery } from '@tanstack/react-query';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

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
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function GenerateTab() {
  const { isPending } = useGenerate();
  const { parameters, isLoading: isLoadingParams, invalidateParameters } = useParameters();
  const [params, setParams] = useState<GenerationParameters>(() => ({
    ...DEFAULT_PARAMS,
    ...parameters
  }));
  const [isSaving, setIsSaving] = useState(false);
  const themeParams = useTelegramTheme();

  // Query for user's models with isSelected flag
  const { data: userModels = [], isLoading: isLoadingModels } = useQuery<LoraModel[]>({
    queryKey: ['models', 'user'],
    queryFn: getUserModels,
    staleTime: 1000, // Update every second
  });

  // Filter selected and completed models
  const selectedModels = useMemo(() => 
    userModels.filter(model => model.isSelected && model.status === 'COMPLETED'),
    [userModels]
  );

  // Map of selected model IDs for quick lookup
  const selectedModelIds = useMemo(() => 
    new Set(selectedModels.map(model => model.databaseId)),
    [selectedModels]
  );

  // Update local state when parameters load, maintaining defaults for missing values
  // and preserving active lora states
  useEffect(() => {
    if (parameters) {
      setParams(currentParams => {
        const updatedParams = {
          ...DEFAULT_PARAMS,
          ...parameters,
          // Keep existing loras that are still selected
          loras: parameters.loras?.filter(lora => selectedModelIds.has(lora.path)) || [],
          // Preserve any runtime changes that aren't in the loaded parameters
          ...Object.fromEntries(
            Object.entries(currentParams).filter(([key]) => 
              !(key in parameters) && key in currentParams
            )
          )
        };
        return updatedParams;
      });
    }
  }, [parameters, selectedModelIds]);

  const updateParam = <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ): void => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value
    }));
  };

  const resetParameter = (paramName: keyof typeof DEFAULT_PARAMS) => {
    updateParam(paramName, DEFAULT_PARAMS[paramName]);
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

  const resetButtonStyle = {
    color: themeParams.button_color,
  };

  if (isLoadingParams || isLoadingModels) {
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
          {selectedModels.length > 0 ? (
            <LoraSelector
              loras={params.loras || []}
              availableLoras={selectedModels.map(lora => ({
                path: lora.databaseId,
                name: lora.name,
                triggerWord: lora.triggerWord
              }))}
              onAdd={handleAddLora}
              onRemove={handleRemoveLora}
              onScaleChange={handleLoraScaleChange}
            />
          ) : (
            <p className="text-sm" style={hintStyle}>
              No selected LoRA models available. Go to the Models tab to select models you want to use.
            </p>
          )}
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium" style={labelStyle}>
                Steps <span style={hintStyle} className="ml-1">({params.num_inference_steps})</span>
              </label>
              <button 
                onClick={() => resetParameter('num_inference_steps')}
                className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
                style={resetButtonStyle}
                title="Reset to default (28)"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium" style={labelStyle}>
                Guidance Scale <span style={hintStyle} className="ml-1">({params.guidance_scale})</span>
              </label>
              <button 
                onClick={() => resetParameter('guidance_scale')}
                className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
                style={resetButtonStyle}
                title="Reset to default (3.5)"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium" style={labelStyle}>
                Number of Images <span style={hintStyle} className="ml-1">({params.num_images})</span>
              </label>
              <button 
                onClick={() => resetParameter('num_images')}
                className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
                style={resetButtonStyle}
                title="Reset to default (1)"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
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
                <SelectValue />
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
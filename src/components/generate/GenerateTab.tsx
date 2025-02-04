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

  const updateParam = <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ): void => {
    setParams((prevParams) => ({
      ...(prevParams || DEFAULT_PARAMS),
      [key]: value
    }));
  };

  const handleAddLora = (lora: LoraParameter) => {
    setParams((prevParams) => ({
      ...(prevParams || DEFAULT_PARAMS),
      loras: [...((prevParams?.loras || []), lora)]
    }));
  };

  const handleRemoveLora = (index: number) => {
    setParams((prevParams) => {
      if (!prevParams) return DEFAULT_PARAMS;
      return {
        ...prevParams,
        loras: prevParams.loras?.filter((_, i) => i !== index) || []
      };
    });
  };

  const handleLoraScaleChange = (index: number, scale: number) => {
    setParams((prevParams) => {
      if (!prevParams) return DEFAULT_PARAMS;
      return {
        ...prevParams,
        loras: prevParams.loras?.map((lora, i) =>
          i === index ? { ...lora, scale } : lora
        ) || []
      };
    });
  };

  const handleSave = async () => {
    if (!params) return;
    
    setIsSaving(true);
    try {
      await saveUserParameters(params);
      
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

  if (isLoading || !params) {
    return (
      <Card className="bg-white rounded-lg shadow-md">
        <div className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <div className="p-6 space-y-8">
        <ModelSelector 
          onSelect={(modelPath: string) => updateParam('modelPath', modelPath)}
          defaultValue={params.modelPath}
        />

        {/* LoRA Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">LoRA Models</h2>
          <LoraSelector
            loras={params.loras || []}
            availableLoras={availableLoras.map(lora => ({
              path: lora.databaseId,
              name: `${lora.name} (${lora.triggerWord})`
            }))}
            onAdd={handleAddLora}
            onRemove={handleRemoveLora}
            onScaleChange={handleLoraScaleChange}
          />
        </div>

        {/* Image Parameters */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Image Parameters</h2>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image Size</label>
            <Select 
              value={params.image_size} 
              onValueChange={v => updateParam('image_size', v as ImageSize)}
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
            <label className="block text-sm font-medium text-gray-700">
              Steps <span className="text-gray-500">({params.num_inference_steps})</span>
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
            <label className="block text-sm font-medium text-gray-700">
              Guidance Scale <span className="text-gray-500">({params.guidance_scale})</span>
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
            <label className="block text-sm font-medium text-gray-700">
              Number of Images <span className="text-gray-500">({params.num_images})</span>
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
            <label className="block text-sm font-medium text-gray-700">Output Format</label>
            <Select 
              value={params.output_format}
              onValueChange={v => updateParam('output_format', v as 'jpeg' | 'png')}
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
        </div>

        {/* Additional Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Additional Options</h2>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Safety Checker</label>
              <p className="text-sm text-gray-500">Filter inappropriate content</p>
            </div>
            <Switch 
              checked={params.enable_safety_checker}
              onCheckedChange={(v: boolean) => updateParam('enable_safety_checker', v)}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sync Mode</label>
              <p className="text-sm text-gray-500">Wait for generation to complete</p>
            </div>
            <Switch 
              checked={params.sync_mode}
              onCheckedChange={(v: boolean) => updateParam('sync_mode', v)}
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          disabled={generate.isPending || isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save Parameters'}
        </button>
      </div>
    </Card>
  );
}
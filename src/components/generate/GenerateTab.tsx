import { useState } from 'react';
import { Card } from '../ui/components';
import { useGenerate } from '@/hooks/useGenerate';
import { ModelSelector } from './ModelSelector';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import type { Model } from '@/types';

const IMAGE_SIZES = {
  landscape_4_3: 'Landscape 4:3',
  landscape_16_9: 'Landscape 16:9',
  square_hd: 'Square HD',
  square: 'Square',
  portrait_4_3: 'Portrait 4:3',
  portrait_16_9: 'Portrait 16:9',
} as const;

type Params = {
  image_size: keyof typeof IMAGE_SIZES;
  num_inference_steps: number;
  seed: number;
  guidance_scale: number;
  num_images: number;
  sync_mode: boolean;
  enable_safety_checker: boolean;
  output_format: 'jpeg' | 'png';
};

export function GenerateTab() {
  const generate = useGenerate();
  const [selectedModel, setSelectedModel] = useState<Model | undefined>(undefined);
  const [params, setParams] = useState<Params>({
    image_size: 'landscape_4_3',
    num_inference_steps: 28,
    seed: Math.floor(Math.random() * 1000000),
    guidance_scale: 3.5,
    num_images: 1,
    sync_mode: false,
    enable_safety_checker: true,
    output_format: 'jpeg'
  });

  const updateParam = <K extends keyof Params>(key: K, value: Params[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Create a data object that includes both the model and parameters
    const data = {
      model: selectedModel?.id,
      ...params
    };

    // Convert the data to a string because Telegram WebApp expects a string
    const dataStr = JSON.stringify(data);

    // Send the data back to the bot
    if (window.Telegram?.WebApp) {
      // Store in localStorage for persistence
      localStorage.setItem('selfi-params', dataStr);
      
      // Send data back to the bot
      window.Telegram.WebApp.sendData(dataStr);
      
      // Close the WebApp
      window.Telegram.WebApp.close();
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <div className="p-6 space-y-8">
        {/* Hidden ModelSelector to handle model selection */}
        <ModelSelector onSelect={setSelectedModel} />

        {/* Image Parameters */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Image Parameters</h2>
          
          {/* Image Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image Size</label>
            <Select 
              value={params.image_size} 
              onValueChange={v => updateParam('image_size', v as keyof typeof IMAGE_SIZES)}
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

          {/* Steps */}
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

          {/* Guidance Scale */}
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

          {/* Number of Images */}
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

          {/* Output Format */}
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
          
          {/* Safety Checker */}
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

          {/* Sync Mode */}
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
          disabled={!selectedModel || generate.isPending}
          onClick={handleSave}
        >
          {generate.isPending ? 'Generating...' : 'Save Parameters'}
        </button>
      </div>
    </Card>
  );
}
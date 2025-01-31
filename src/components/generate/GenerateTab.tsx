import { useState } from 'react';
import { Card } from '../ui/components';
import { useGenerate } from '@/hooks/useGenerate';
import { ModelSelector } from './ModelSelector';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

const IMAGE_SIZES = {
  landscape_4_3: 'Landscape 4:3',
  landscape_16_9: 'Landscape 16:9',
  square_hd: 'Square HD',
  square: 'Square',
  portrait_4_3: 'Portrait 4:3',
  portrait_16_9: 'Portrait 16:9',
};

export function GenerateTab() {
  const generate = useGenerate();
  const [selectedModel, setSelectedModel] = useState(null);
  const [params, setParams] = useState({
    image_size: 'landscape_4_3',
    num_inference_steps: 28,
    seed: Math.floor(Math.random() * 1000000),
    guidance_scale: 3.5,
    num_images: 1,
    sync_mode: false,
    enable_safety_checker: true,
    output_format: 'jpeg'
  });

  const updateParam = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
    // Store params in localStorage
    const stored = JSON.parse(localStorage.getItem('selfi-params') || '{}');
    localStorage.setItem('selfi-params', JSON.stringify({ ...stored, [key]: value }));
  };

  return (
    <Card className="space-y-6 p-4">
      <ModelSelector onSelect={setSelectedModel} />

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Image Size</label>
          <Select 
            value={params.image_size} 
            onValueChange={v => updateParam('image_size', v)}
          >
            <SelectTrigger>
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
          <label className="text-sm font-medium">Steps ({params.num_inference_steps})</label>
          <Slider 
            value={[params.num_inference_steps]}
            onValueChange={([v]) => updateParam('num_inference_steps', v)}
            min={1}
            max={50}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Guidance Scale ({params.guidance_scale})</label>
          <Slider 
            value={[params.guidance_scale]}
            onValueChange={([v]) => updateParam('guidance_scale', v)}
            min={1}
            max={20}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Images ({params.num_images})</label>
          <Slider 
            value={[params.num_images]}
            onValueChange={([v]) => updateParam('num_images', v)}
            min={1}
            max={4}
            step={1}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Safety Checker</label>
          <Switch 
            checked={params.enable_safety_checker}
            onCheckedChange={v => updateParam('enable_safety_checker', v)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Output Format</label>
          <Select 
            value={params.output_format}
            onValueChange={v => updateParam('output_format', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Sync Mode</label>
          <Switch 
            checked={params.sync_mode}
            onCheckedChange={v => updateParam('sync_mode', v)}
          />
        </div>
      </div>

      <button
        className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50 hover:bg-blue-600"
        disabled={!selectedModel || generate.isPending}
        onClick={() => {
          // Store all params
          localStorage.setItem('selfi-params', JSON.stringify(params));
          // Close WebApp
          window.Telegram?.WebApp?.close();
        }}
      >
        {generate.isPending ? 'Generating...' : 'Save Parameters'}
      </button>
    </Card>
  );
}
import { useCallback } from 'react';
import type { GenerationParameters } from '@/types';
import type { TelegramThemeParams } from '@/types/telegram';
import { generateFalSeed, expandCompressedSeed, isCompressedSeed } from '@/lib/seed';

interface Props {
  params: GenerationParameters;
  updateParam: <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ) => void;
  themeParams: TelegramThemeParams;
}

export function ImageParameters({ params, updateParam, themeParams }: Props) {
  const labelStyle = {
    color: themeParams.text_color,
  };

  const handleRandomSeed = useCallback(() => {
    const newSeed = generateFalSeed();
    updateParam('seed', newSeed);
  }, [updateParam]);

  const handleSeedChange = useCallback((value: string) => {
    const seedValue = parseInt(value);
    if (!isNaN(seedValue)) {
      if (isCompressedSeed(seedValue)) {
        updateParam('seed', expandCompressedSeed(seedValue));
      } else {
        updateParam('seed', seedValue);
      }
    }
  }, [updateParam]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold" style={labelStyle}>Image Parameters</h2>

      {/* Image Format */}
      <div className="space-y-2">
        <label className="block font-medium" style={labelStyle}>
          Format
        </label>
        <select
          value={params.image_size}
          onChange={e => updateParam('image_size', e.target.value as 'square' | 'portrait_16_9')}
          className="block w-full px-3 py-2 bg-transparent border rounded focus:outline-none focus:ring-1"
          style={{ borderColor: `${themeParams.button_color}40` }}
        >
          <option value="square">Square (1:1)</option>
          <option value="portrait_16_9">Portrait (16:9)</option>
        </select>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <label className="block font-medium" style={labelStyle}>
          Steps: {params.num_inference_steps}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={params.num_inference_steps}
          onChange={e => updateParam('num_inference_steps', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* CFG Scale */}
      <div className="space-y-2">
        <label className="block font-medium" style={labelStyle}>
          CFG Scale: {params.guidance_scale}
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="0.1"
          value={params.guidance_scale}
          onChange={e => updateParam('guidance_scale', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Number of Images */}
      <div className="space-y-2">
        <label className="block font-medium" style={labelStyle}>
          Number of Images: {params.num_images}
        </label>
        <input
          type="range"
          min="1"
          max="4"
          value={params.num_images}
          onChange={e => updateParam('num_images', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Seed */}
      <div className="space-y-2">
        <label className="block font-medium" style={labelStyle}>
          Seed
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={params.seed || 0}
            onChange={e => handleSeedChange(e.target.value)}
            className="block w-full px-3 py-2 bg-transparent border rounded focus:outline-none focus:ring-1"
            style={{ borderColor: `${themeParams.button_color}40` }}
          />
          <button
            onClick={handleRandomSeed}
            className="px-4 py-2 text-sm font-medium shadow-sm hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors rounded"
            style={{ backgroundColor: themeParams.button_color, color: themeParams.button_text_color }}
          >
            Random
          </button>
        </div>
      </div>

      {/* Safety Checker */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={params.enable_safety_checker}
          onChange={e => updateParam('enable_safety_checker', e.target.checked)}
          className="h-4 w-4"
        />
        <label className="font-medium" style={labelStyle}>
          Enable Safety Checker
        </label>
      </div>
    </div>
  );
}
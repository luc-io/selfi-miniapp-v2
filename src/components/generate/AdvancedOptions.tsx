import { useState } from 'react';
import { Input, Textarea } from '../ui/components';
import type { AdvancedOptionsProps } from './types';

export function AdvancedOptions({ onChange }: AdvancedOptionsProps) {
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState('');

  const handleNegativePromptChange = (value: string) => {
    setNegativePrompt(value);
    onChange({ negativePrompt: value, seed: Number(seed) || undefined });
  };

  const handleSeedChange = (value: string) => {
    setSeed(value);
    onChange({ negativePrompt, seed: Number(value) || undefined });
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={negativePrompt}
        onChange={handleNegativePromptChange}
        placeholder="Negative prompt (things to avoid in the image)..."
      />
      
      <Input
        value={seed}
        onChange={handleSeedChange}
        placeholder="Seed (optional)"
        type="number"
      />
    </div>
  );
}
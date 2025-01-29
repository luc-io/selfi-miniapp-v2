import React from 'react';
import { Input, Textarea } from '../ui/Layout';

interface AdvancedOptionsProps {
  negativePrompt?: string;
  seed?: number;
  onChange: (options: { negativePrompt?: string; seed?: number }) => void;
  disabled?: boolean;
}

export function AdvancedOptions({
  negativePrompt,
  seed,
  onChange,
  disabled
}: AdvancedOptionsProps) {
  const handleNegativePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      negativePrompt: e.target.value,
      seed
    });
  };

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({
      negativePrompt,
      seed: value ? parseInt(value) : undefined
    });
  };

  return (
    <div className="space-y-4">
      <Textarea
        label="Negative Prompt"
        placeholder="Things you don't want in the image..."
        value={negativePrompt}
        onChange={handleNegativePromptChange}
        disabled={disabled}
      />

      <Input
        type="number"
        label="Seed"
        placeholder="Random seed"
        value={seed ?? ''}
        onChange={handleSeedChange}
        disabled={disabled}
      />

      <div className="text-xs text-gray-500">
        Using the same seed with the same prompt and style will generate the same image.
      </div>
    </div>
  );
}
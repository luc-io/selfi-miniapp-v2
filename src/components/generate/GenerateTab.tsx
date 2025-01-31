import { useState } from 'react';
import { Card, Button, Textarea } from '../ui/components';
import { useGenerate } from '@/hooks/useGenerate';
import { ModelSelector } from './ModelSelector';
import { AdvancedOptions } from './AdvancedOptions';
import type { Model } from '@/types';

export function GenerateTab() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [advancedOptions, setAdvancedOptions] = useState({});
  const generate = useGenerate();

  const handleGenerate = () => {
    generate.mutate({
      prompt,
      loraId: selectedModel?.id,
      ...advancedOptions,
    });
  };

  return (
    <Card>
      <div className="space-y-4">
        <Textarea 
          value={prompt}
          onChange={setPrompt}
          placeholder="Enter your prompt..."
        />
        
        <ModelSelector onSelect={setSelectedModel} />
        <AdvancedOptions onChange={setAdvancedOptions} />
        
        <Button 
          onClick={handleGenerate}
          disabled={!prompt.trim() || generate.isPending}
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {generate.isPending ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </Card>
  );
}
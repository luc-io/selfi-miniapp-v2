import { useState } from 'react';
import { Card, Button, Textarea } from '../ui/components';
import { useGenerate } from '@/hooks/useGenerate';
import { ModelSelector } from './ModelSelector';
import { AdvancedOptions } from './AdvancedOptions';

export function GenerateTab() {
  const [prompt, setPrompt] = useState('');
  const generate = useGenerate();

  return (
    <Card>
      <div className="space-y-4">
        <Textarea 
          value={prompt}
          onChange={setPrompt}
          placeholder="Enter your prompt..."
        />
        
        <ModelSelector />
        <AdvancedOptions />
        
        <Button 
          onClick={() => generate.mutate({ prompt })}
          disabled={!prompt.trim() || generate.isPending}
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {generate.isPending ? 'Generating...' : 'Generate'}
        </Button>
      </div>
    </Card>
  );
}
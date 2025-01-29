import React, { useState } from 'react';
import { Wand2, Settings } from 'lucide-react';
import { Card, Button, Textarea } from '../ui/Layout';
import { useGenerateImage } from '@/hooks/useGenerate';
import { ModelSelector } from './ModelSelector';
import { AdvancedOptions } from './AdvancedOptions';
import type { LoraModel } from '@/api';

interface GenerateForm {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  selectedModel?: LoraModel;
}

export function GenerateTab() {
  const [form, setForm] = useState<GenerateForm>({
    prompt: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { generate, isGenerating } = useGenerateImage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prompt.trim() || isGenerating) return;

    try {
      await generate({
        prompt: form.prompt,
        negativePrompt: form.negativePrompt,
        loraId: form.selectedModel?.id,
        seed: form.seed
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, prompt: e.target.value }));
  };

  const handleModelSelect = (model: LoraModel | undefined) => {
    setForm(prev => ({ ...prev, selectedModel: model }));
  };

  const handleAdvancedChange = (options: { negativePrompt?: string; seed?: number }) => {
    setForm(prev => ({ ...prev, ...options }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <Textarea
          label="What would you like to generate?"
          placeholder="A photo of a red cat playing with yarn..."
          value={form.prompt}
          onChange={handlePromptChange}
          disabled={isGenerating}
          rows={3}
        />

        <div className="mt-4">
          <ModelSelector
            selected={form.selectedModel}
            onSelect={handleModelSelect}
            disabled={isGenerating}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          <Button
            type="submit"
            disabled={!form.prompt.trim() || isGenerating}
            isLoading={isGenerating}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t">
            <AdvancedOptions
              negativePrompt={form.negativePrompt}
              seed={form.seed}
              onChange={handleAdvancedChange}
              disabled={isGenerating}
            />
          </div>
        )}
      </Card>

      {/* Results will be shown through react-query cache */}
    </form>
  );
}
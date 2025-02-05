import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Upload } from 'lucide-react';

interface QueueUpdate {
  status: string;
  logs?: string;
}

interface TrainingState {
  images: File | null;
  triggerWord: string;
  createMasks: boolean;
  steps: number;
  isStyle: boolean;
  isPreprocessed: boolean;
  progress: number;
}

const DEFAULT_STATE: TrainingState = {
  images: null,
  triggerWord: '',
  createMasks: true,
  steps: 1000,
  isStyle: false,
  isPreprocessed: false,
  progress: 0
};

export function TrainTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<TrainingState>(DEFAULT_STATE);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setState(prev => ({ ...prev, images: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.images) return;

    try {
      setIsLoading(true);
      // Temporarily commented out until fal-ai client is installed
      /*
      const imageUrl = await fal.storage.upload(state.images);

      await fal.client.subscribe('luc-io/train', {
        input: {
          images_data_url: imageUrl,
          trigger_word: state.triggerWord,
          create_masks: state.createMasks,
          steps: state.steps,
          is_style: state.isStyle,
          is_input_format_already_preprocessed: state.isPreprocessed,
        },
        onQueueUpdate: (update: QueueUpdate) => {
          if (update.status === 'IN_PROGRESS' && update.logs) {
            const match = update.logs.match(/(\d+)%/);
            if (match) {
              setState(prev => ({ ...prev, progress: parseInt(match[1]) }));
            }
          }
        }
      });
      */

      window.Telegram?.WebApp?.showPopup({
        message: 'Training completed successfully!'
      });

    } catch (error) {
      console.error('Training error:', error);
      window.Telegram?.WebApp?.showPopup({
        message: 'Training failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
      setState(prev => ({ ...prev, progress: 0 }));
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <h2 className="text-xl font-semibold text-gray-800">Train Model</h2>
        
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="images">Training Images (ZIP)</Label>
            <div className="mt-1">
              <label 
                className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none ${
                  state.images ? 'border-green-500' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <Upload className={`w-8 h-8 ${state.images ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="mt-2 text-sm text-gray-600">
                    {state.images ? state.images.name : 'Drop your ZIP file here or click to browse'}
                  </span>
                </div>
                <Input
                  id="images"
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Trigger Word */}
          <div className="space-y-2">
            <Label htmlFor="triggerWord">Trigger Word</Label>
            <Input
              id="triggerWord"
              value={state.triggerWord}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setState(prev => ({ ...prev, triggerWord: e.target.value }))}
              placeholder="Enter a trigger word"
            />
          </div>

          {/* Training Steps */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Training Steps</Label>
              <span className="text-sm text-gray-500">{state.steps}</span>
            </div>
            <Slider 
              value={[state.steps]}
              onValueChange={v => setState(prev => ({ ...prev, steps: v[0] }))}
              min={100}
              max={2000}
              step={100}
              className="py-2"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="createMasks">Create Masks</Label>
                <p className="text-sm text-gray-500">Use segmentation masks in training</p>
              </div>
              <Switch
                id="createMasks"
                checked={state.createMasks}
                onCheckedChange={checked => setState(prev => ({ ...prev, createMasks: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isStyle">Style Training</Label>
                <p className="text-sm text-gray-500">Train for style instead of subject</p>
              </div>
              <Switch
                id="isStyle"
                checked={state.isStyle}
                onCheckedChange={checked => setState(prev => ({ ...prev, isStyle: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPreprocessed">Pre-processed Input</Label>
                <p className="text-sm text-gray-500">Input is already preprocessed</p>
              </div>
              <Switch
                id="isPreprocessed"
                checked={state.isPreprocessed}
                onCheckedChange={checked => setState(prev => ({ ...prev, isPreprocessed: checked }))}
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {state.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Training Progress</span>
              <span>{state.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !state.images}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Training Model...
            </div>
          ) : (
            'Start Training'
          )}
        </Button>
      </form>
    </Card>
  );
}
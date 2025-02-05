import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Upload } from 'lucide-react';

interface TrainingState {
  images: File | null;
  triggerWord: string;
  createMasks: boolean;
  steps: number;
  isStyle: boolean;
}

const DEFAULT_STATE: TrainingState = {
  images: null,
  triggerWord: '',
  createMasks: true,
  steps: 1000,
  isStyle: false,
};

export function TrainTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<TrainingState>(DEFAULT_STATE);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        window.Telegram?.WebApp?.showPopup({
          message: 'File size must be less than 50MB'
        });
        return;
      }
      setState(prev => ({ ...prev, images: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.images) return;

    // Validate trigger word
    if (!state.triggerWord.trim() && !state.isStyle) {
      window.Telegram?.WebApp?.showPopup({
        message: 'Please enter a trigger word'
      });
      return;
    }

    try {
      setIsLoading(true);
      // Training implementation will be handled by backend

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
      setProgress(0);
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <h2 className="text-xl font-semibold text-gray-800">Train Model</h2>
        
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Training Images (ZIP)</label>
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
                <input
                  id="images"
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 50MB
              </p>
            </div>
          </div>

          {/* Trigger Word */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700" htmlFor="triggerWord">
              Trigger Word
            </label>
            <input
              id="triggerWord"
              type="text"
              value={state.triggerWord}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setState(prev => ({ ...prev, triggerWord: e.target.value }))}
              placeholder="Enter a trigger word"
              disabled={state.isStyle}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Training Steps */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">Training Steps</label>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="block text-sm font-medium text-gray-700">Create Masks</label>
                <p className="text-sm text-gray-500">Use segmentation masks in training</p>
              </div>
              <Switch
                checked={state.createMasks}
                onCheckedChange={checked => setState(prev => ({ ...prev, createMasks: checked }))}
                disabled={state.isStyle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="block text-sm font-medium text-gray-700">Style Training</label>
                <p className="text-sm text-gray-500">Train for style instead of subject</p>
              </div>
              <Switch
                checked={state.isStyle}
                onCheckedChange={checked => setState(prev => ({ 
                  ...prev, 
                  isStyle: checked,
                  createMasks: checked ? false : prev.createMasks,
                  triggerWord: checked ? '' : prev.triggerWord
                }))}
              />
            </div>
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Training Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
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
          </button>
        </div>
      </form>
    </Card>
  );
}
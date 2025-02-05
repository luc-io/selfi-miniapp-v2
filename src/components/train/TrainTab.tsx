import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Upload, X, Edit2 } from 'lucide-react';
import { startTraining, getTrainingProgress, type TrainingProgress } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { Query } from '@tanstack/react-query';

interface TrainingImage {
  file: File;
  caption: string;
}

interface TrainingState {
  images: TrainingImage[];
  triggerWord: string;
  createMasks: boolean;
  steps: number;
  isStyle: boolean;
}

const DEFAULT_STATE: TrainingState = {
  images: [],
  triggerWord: '',
  createMasks: true,
  steps: 1000,
  isStyle: false,
};

export function TrainTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<TrainingState>(DEFAULT_STATE);
  const [dragActive, setDragActive] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const totalSize = state.images.reduce((acc: number, img: TrainingImage) => acc + img.file.size, 0);
  const maxSize = 50 * 1024 * 1024; // 50MB

  // Query for training progress
  const { data: progressData } = useQuery({
    queryKey: ['training-progress', requestId],
    queryFn: () => getTrainingProgress(requestId),
    enabled: !!requestId && !isLoading,
    refetchInterval: (query: Query<TrainingProgress | null, Error>) => {
      const data = query.state.data;
      if (!data || data.status === 'completed' || data.status === 'failed') {
        return false;
      }
      return 1000; // Poll every second while training
    },
  });

  // Reset request ID when training completes or fails
  useEffect(() => {
    if (progressData?.status === 'completed' || progressData?.status === 'failed') {
      setRequestId(null);
      setIsLoading(false);
      
      // Show completion message
      window.Telegram?.WebApp?.showPopup({
        message: progressData.status === 'completed' 
          ? 'Training completed successfully!' 
          : 'Training failed. Please try again.'
      });
    }
  }, [progressData?.status]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files);
    const newTotalSize = totalSize + imageFiles.reduce((acc, file) => acc + file.size, 0);

    if (newTotalSize > maxSize) {
      window.Telegram?.WebApp?.showPopup({
        message: 'Total file size must be less than 50MB'
      });
      return;
    }

    const newImages = imageFiles.map(file => ({
      file,
      caption: file.name.replace(/\.[^/.]+$/, '') // Remove extension
    }));

    setState(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  }, [totalSize, maxSize]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeImage = (index: number) => {
    setState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateCaption = (index: number, caption: string) => {
    setState(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, caption } : img
      )
    }));
    setEditingIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.images.length === 0) return;

    // Validate trigger word
    if (!state.triggerWord.trim() && !state.isStyle) {
      window.Telegram?.WebApp?.showPopup({
        message: 'Please enter a trigger word'
      });
      return;
    }

    try {
      setIsLoading(true);

      // Prepare captions map
      const captions: Record<string, string> = {};
      state.images.forEach(img => {
        captions[img.file.name] = img.caption;
      });

      // Start training
      const newRequestId = await startTraining({
        steps: state.steps,
        isStyle: state.isStyle,
        createMasks: state.createMasks,
        triggerWord: state.triggerWord,
        images: state.images.map(img => img.file),
        captions,
      });

      setRequestId(newRequestId);

      window.Telegram?.WebApp?.showPopup({
        message: 'Training started successfully!'
      });

    } catch (error) {
      console.error('Training error:', error);
      window.Telegram?.WebApp?.showPopup({
        message: 'Training failed. Please try again.'
      });
      setIsLoading(false);
    }
  };

  const progress = progressData?.progress ?? 0;

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <h2 className="text-xl font-semibold text-gray-800">Train Model</h2>
        
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Training Images</label>
            <div 
              className="mt-1"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <label 
                className={`flex justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              >
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">
                    Drop images here or click to browse
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    {((totalSize / 1024 / 1024).toFixed(1))} MB of 50 MB used
                  </span>
                </div>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Previews */}
            {state.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {state.images.map((img, index) => (
                  <div key={index} className="relative group space-y-1">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(img.file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {editingIndex === index ? (
                      <div className="flex space-x-1">
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => updateCaption(index, e.target.value)}
                          onBlur={() => setEditingIndex(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingIndex(null)}
                          autoFocus
                          className="w-full text-xs px-1 py-0.5 border rounded"
                        />
                      </div>
                    ) : (
                      <div 
                        className="flex items-center space-x-1 group/caption cursor-pointer"
                        onClick={() => setEditingIndex(index)}
                      >
                        <p className="text-xs text-gray-500 truncate flex-1">
                          {img.caption}
                        </p>
                        <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover/caption:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Click on the caption below each image to edit
            </p>
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
              {progressData?.message && (
                <p className="text-sm text-gray-600">{progressData.message}</p>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            disabled={isLoading || state.images.length === 0}
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
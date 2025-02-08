import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { startTraining } from '@/lib/api';
import { 
  FileUpload,
  ImagePreviews,
  TriggerWordInput,
  TrainingSteps,
  TrainingToggles 
} from './components';
import { DEFAULT_STATE, type TrainingImage } from './types/training';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const TrainTab: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);

  const totalSize = state.images.reduce((acc: number, img: TrainingImage) => acc + img.file.size, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.images.length === 0 || !state.triggerWord.trim()) return;

    try {
      setIsLoading(true);
      console.log('Starting training process with state:', {
        steps: state.steps,
        isStyle: state.isStyle,
        createMasks: state.createMasks,
        triggerWord: state.triggerWord,
        imagesCount: state.images.length
      });

      // Extract files and captions
      const files = state.images.map(img => img.file);
      const captions = state.images.reduce((acc, img) => {
        acc[img.file.name] = img.caption;
        return acc;
      }, {} as Record<string, string>);

      const trainingResult = await startTraining({
        steps: state.steps,
        isStyle: state.isStyle,
        createMasks: state.createMasks,
        triggerWord: state.triggerWord,
      }, files, captions).catch(error => {
        console.error('Training failed:', error);
        throw new Error('Training failed: ' + (error.message || 'Unknown error'));
      });

      console.log('Training started successfully:', trainingResult);

      window.Telegram?.WebApp?.showPopup({
        message: 'Training started successfully!'
      });

      // Reset form
      setState(DEFAULT_STATE);
      setIsLoading(false);

    } catch (error) {
      console.error('Training process failed:', error);
      let errorMessage = 'Training failed: ';
      
      if (error instanceof Error) {
        errorMessage += error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage += JSON.stringify(error);
      } else {
        errorMessage += 'Unknown error occurred';
      }

      window.Telegram?.WebApp?.showPopup({
        message: errorMessage
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card shadow-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <h2 className="text-xl font-semibold text-card-foreground">Train Model</h2>
        
        <div className="space-y-6">
          <FileUpload
            totalSize={totalSize}
            maxSize={MAX_SIZE}
            onFilesSelected={newImages => 
              setState(prev => ({ 
                ...prev, 
                images: [...prev.images, ...newImages] 
              }))
            }
          />

          <ImagePreviews
            images={state.images}
            onImageRemove={index => 
              setState(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
              }))
            }
            onCaptionUpdate={(index, caption) =>
              setState(prev => ({
                ...prev,
                images: prev.images.map((img, i) => 
                  i === index ? { ...img, caption } : img
                )
              }))
            }
          />

          <TriggerWordInput
            value={state.triggerWord}
            isStyle={state.isStyle}
            onChange={triggerWord => setState(prev => ({ ...prev, triggerWord }))}
          />

          <TrainingSteps
            value={state.steps}
            onChange={steps => setState(prev => ({ ...prev, steps }))}
          />

          <TrainingToggles
            isStyle={state.isStyle}
            createMasks={state.createMasks}
            onStyleChange={isStyle => setState(prev => ({ 
              ...prev, 
              isStyle,
              createMasks: isStyle ? false : prev.createMasks
            }))}
            onMasksChange={createMasks => setState(prev => ({ ...prev, createMasks }))}
          />

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
            disabled={isLoading || state.images.length === 0 || !state.triggerWord.trim()}
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
};

export default TrainTab;
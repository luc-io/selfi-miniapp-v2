import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { startTraining, getUserInfo, type UserInfo } from '@/lib/api';
import { 
  FileUpload,
  ImagePreviews,
  TriggerWordInput,
  TrainingSteps,
  TrainingToggles 
} from './components';
import { DEFAULT_STATE, type TrainingImage } from './types/training';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const TRAINING_COST = 150; // Cost in stars for training

const TrainTab: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error('Failed to load user info:', error);
        setErrorMessage('Failed to load user information');
      }
    };

    loadUserInfo();
  }, []);

  const totalSize = state.images.reduce((acc: number, img: TrainingImage) => acc + img.file.size, 0);
  const hasEnoughStars = userInfo ? userInfo.stars >= TRAINING_COST : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.images.length === 0 || !state.triggerWord.trim()) return;

    // Clear any previous error messages
    setErrorMessage(null);

    // Check if user has enough stars
    if (!hasEnoughStars) {
      setErrorMessage(`Insufficient stars. Training requires ${TRAINING_COST} stars. You have ${userInfo?.stars || 0} stars.`);
      window.Telegram?.WebApp?.showPopup({
        message: `You need ${TRAINING_COST} stars to start training. Current balance: ${userInfo?.stars || 0} stars.`
      });
      return;
    }

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

      // Update user info after successful training start
      const updatedInfo = await getUserInfo();
      setUserInfo(updatedInfo);

      window.Telegram?.WebApp?.showPopup({
        message: 'Training started successfully!'
      });

      // Reset form
      setState(DEFAULT_STATE);

    } catch (error) {
      console.error('Training process failed:', error);
      let errorMessage = 'Training failed: ';
      
      if (error instanceof Error) {
        if (error.message.includes('Insufficient stars')) {
          errorMessage = `You need ${TRAINING_COST} stars to start training. Current balance: ${userInfo?.stars || 0} stars.`;
        } else {
          errorMessage += error.message;
        }
      } else if (typeof error === 'object' && error !== null) {
        errorMessage += JSON.stringify(error);
      } else {
        errorMessage += 'Unknown error occurred';
      }

      setErrorMessage(errorMessage);
      window.Telegram?.WebApp?.showPopup({
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card shadow-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-card-foreground">Train Model</h2>
          <div className="text-sm text-muted-foreground">
            Training Cost: <span className="font-semibold text-primary">{TRAINING_COST} ⭐</span>
          </div>
        </div>

        {userInfo && (
          <div className="text-sm text-muted-foreground">
            Your Balance: <span className={`font-semibold ${hasEnoughStars ? 'text-green-600' : 'text-red-600'}`}>
              {userInfo.stars} ⭐
            </span>
          </div>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
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
            disabled={isLoading || state.images.length === 0 || !state.triggerWord.trim() || !hasEnoughStars}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Training Model...
              </div>
            ) : !hasEnoughStars ? (
              'Insufficient Stars'
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
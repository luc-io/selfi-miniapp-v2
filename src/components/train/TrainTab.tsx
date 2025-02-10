import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { 
  startTraining, 
  getUserInfo, 
  getTrainingStatus,
  cancelTraining,
  type UserInfo, 
  type TrainingProgress as TrainingProgressType
} from '@/lib/api';
import { 
  FileUpload,
  ImagePreviews,
  TriggerWordInput,
  TrainingSteps,
  TrainingToggles,
  TrainingProgress
} from './components';
import { DEFAULT_STATE, type TrainingImage } from './types/training';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const TRAINING_COST = 150; // Cost in stars for training
const POLLING_INTERVAL = 3000; // 3 seconds

const TrainTab: React.FC = () => {
  const themeParams = useTelegramTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgressType | null>(null);
  const [currentTrainingId, setCurrentTrainingId] = useState<string | null>(null);

  // Load user info on mount
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

  // Poll training status
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollTrainingStatus = async () => {
      if (!currentTrainingId) return;

      try {
        const progress = await getTrainingStatus(currentTrainingId);
        setTrainingProgress(progress);

        // Stop polling if training is complete or failed
        if (['completed', 'failed', 'cancelled'].includes(progress.status.toLowerCase())) {
          setCurrentTrainingId(null);
          // Refresh user info to get updated stars
          const info = await getUserInfo();
          setUserInfo(info);
        }
      } catch (error) {
        console.error('Failed to get training status:', error);
        setErrorMessage('Failed to get training status');
        setCurrentTrainingId(null);
      }
    };

    if (currentTrainingId) {
      // Poll immediately
      pollTrainingStatus();
      // Then start interval
      interval = setInterval(pollTrainingStatus, POLLING_INTERVAL);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentTrainingId]);

  const totalSize = state.images.reduce((acc: number, img: TrainingImage) => acc + img.file.size, 0);
  const hasEnoughStars = userInfo ? userInfo.stars >= TRAINING_COST : false;

  const handleCancel = async () => {
    if (!currentTrainingId) return;

    try {
      setIsCancelling(true);
      await cancelTraining(currentTrainingId);
      
      // Update will be caught by polling
    } catch (error) {
      console.error('Failed to cancel training:', error);
      setErrorMessage('Failed to cancel training');
    } finally {
      setIsCancelling(false);
    }
  };

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
      }, files, captions);

      console.log('Training started successfully:', trainingResult);

      // Set training ID for polling
      setCurrentTrainingId(trainingResult.trainingId);

      // Update user info after successful training start
      const updatedInfo = await getUserInfo();
      setUserInfo(updatedInfo);

      window.Telegram?.WebApp?.showPopup({
        message: 'Training started successfully!'
      });

      // Reset form after successful start
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

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const buttonStyle = {
    backgroundColor: themeParams.button_color,
    color: themeParams.button_text_color,
  };

  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  const balanceStyle = {
    color: hasEnoughStars ? '#34C759' : '#FF3B30',
  };

  const costStyle = {
    color: themeParams.button_color,
  };

  return (
    <Card className="shadow-md" style={cardStyle}>
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold" style={labelStyle}>Train Model</h2>
          <div className="text-sm" style={hintStyle}>
            Training Cost: <span style={costStyle}>{TRAINING_COST} ⭐</span>
          </div>
        </div>

        {userInfo && (
          <div className="text-sm" style={hintStyle}>
            Your Balance:{' '}
            <span style={balanceStyle} className="font-semibold">
              {userInfo.stars} ⭐
            </span>
          </div>
        )}

        {errorMessage && (
          <Alert variant="destructive" style={{
            backgroundColor: '#FF3B3020',
            color: '#FF3B30',
            borderColor: '#FF3B3040'
          }}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {trainingProgress && (
          <TrainingProgress
            progress={trainingProgress}
            onCancel={handleCancel}
            isLoadingCancel={isCancelling}
          />
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
            disabled={!!currentTrainingId}
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
            disabled={!!currentTrainingId}
          />

          <TriggerWordInput
            value={state.triggerWord}
            isStyle={state.isStyle}
            onChange={triggerWord => setState(prev => ({ ...prev, triggerWord }))}
            disabled={!!currentTrainingId}
          />

          <TrainingSteps
            value={state.steps}
            onChange={steps => setState(prev => ({ ...prev, steps }))}
            disabled={!!currentTrainingId}
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
            disabled={!!currentTrainingId}
          />

          <button 
            type="submit" 
            className="w-full py-3 px-4 text-sm font-semibold shadow-sm hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={buttonStyle}
            disabled={isLoading || state.images.length === 0 || !state.triggerWord.trim() || !hasEnoughStars || !!currentTrainingId}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Training Model...
              </div>
            ) : currentTrainingId ? (
              'Training in Progress'
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
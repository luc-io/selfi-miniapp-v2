import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { getUserInfo, startTraining, type UserInfo } from '@/lib/api';
import { useTrainingState, useTrainingStatus } from './hooks';
import { TrainingForm, CostDisplay, ErrorDisplay, TrainingStatus } from './components';

const TRAINING_COST = 150; // Cost in stars for training

export function TrainTab() {
  const themeParams = useTelegramTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    state,
    setImages,
    setTriggerWord,
    setSteps,
    setStyle,
    setMasks,
    resetState
  } = useTrainingState();

  const {
    progress,
    isTraining,
    startTraining: startTrainingProgress,
    finishTraining,
    updateProgress,
    setError: setTrainingError
  } = useTrainingStatus();

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

  const hasEnoughStars = userInfo ? userInfo.stars >= TRAINING_COST : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.images.length === 0 || !state.triggerWord.trim()) return;

    setErrorMessage(null);

    if (!hasEnoughStars) {
      const message = `Insufficient stars. Training requires ${TRAINING_COST} stars. You have ${userInfo?.stars || 0} stars.`;
      setErrorMessage(message);
      window.Telegram?.WebApp?.showPopup({ message });
      return;
    }

    try {
      setIsLoading(true);
      startTrainingProgress();

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

      // Update user info after successful training start
      const updatedInfo = await getUserInfo();
      setUserInfo(updatedInfo);

      window.Telegram?.WebApp?.showPopup({
        message: 'Training started successfully!'
      });

      resetState();

    } catch (error) {
      console.error('Training process failed:', error);
      let errorMessage = 'Training failed: ';
      
      if (error instanceof Error) {
        if (error.message.includes('Insufficient stars')) {
          errorMessage = `You need ${TRAINING_COST} stars to start training. Current balance: ${userInfo?.stars || 0} stars.`;
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred';
      }

      setErrorMessage(errorMessage);
      setTrainingError(errorMessage);
      window.Telegram?.WebApp?.showPopup({ message: errorMessage });

    } finally {
      setIsLoading(false);
      finishTraining();
    }
  };

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  return (
    <Card className="shadow-md" style={cardStyle}>
      <div className="p-6 space-y-8">
        <CostDisplay
          trainingCost={TRAINING_COST}
          userInfo={userInfo}
          hasEnoughStars={hasEnoughStars}
        />

        <ErrorDisplay message={errorMessage} />

        <TrainingForm
          isLoading={isLoading}
          images={state.images}
          triggerWord={state.triggerWord}
          steps={state.steps}
          isStyle={state.isStyle}
          createMasks={state.createMasks}
          hasEnoughStars={hasEnoughStars}
          onSubmit={handleSubmit}
          onImagesChange={setImages}
          onTriggerWordChange={setTriggerWord}
          onStepsChange={setSteps}
          onStyleChange={setStyle}
          onMasksChange={setMasks}
        />

        <TrainingStatus
          isVisible={isTraining}
          progress={progress}
        />
      </div>
    </Card>
  );
}

export default TrainTab;
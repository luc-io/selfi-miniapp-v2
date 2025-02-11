import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { useStarBalance } from '@/hooks/useStarBalance';
import { useBalanceRefresh } from '@/hooks/useBalanceRefresh';
import { startTraining } from '@/lib/api';
import { useTrainingState, useTrainingStatus } from '../hooks';
import { TrainingForm, CostDisplay, ErrorDisplay, TrainingStatus } from '../components';

const TRAINING_COST = 150; // Cost in stars for training

export function TrainTab() {
  const themeParams = useTelegramTheme();
  const [isLoading, setIsLoading] = useState(false);
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
    setError: setTrainingError
  } = useTrainingStatus();

  const { userInfo, refreshBalance } = useStarBalance();
  
  // Set up automatic balance refresh
  useBalanceRefresh(refreshBalance);

  const hasEnoughStars = userInfo ? userInfo.stars >= TRAINING_COST : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.images.length === 0 || !state.triggerWord.trim()) return;

    // Clear any previous error messages
    setErrorMessage(null);

    // Check if user has enough stars
    if (!hasEnoughStars) {
      const errorMsg = `Insufficient stars. Training requires ${TRAINING_COST} stars. You have ${userInfo?.stars || 0} stars.`;
      setErrorMessage(errorMsg);
      window.Telegram?.WebApp?.showPopup({
        message: `You need ${TRAINING_COST} stars to start training. Current balance: ${userInfo?.stars || 0} stars.`
      });
      return;
    }

    try {
      setIsLoading(true);

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

      // Start progress tracking with training ID
      if (trainingResult.trainingId) {
        console.log('Starting training progress tracking with ID:', trainingResult.trainingId);
        startTrainingProgress(trainingResult.trainingId);
      } else {
        console.warn('No training ID received from backend');
      }

      // Update user info after successful training start
      await refreshBalance();

      window.Telegram?.WebApp?.showPopup({
        message: 'Training started successfully!'
      });

      // Reset form
      resetState();

    } catch (error) {
      console.error('Training process failed:', error);
      let errorMsg = 'Training failed: ';
      
      if (error instanceof Error) {
        if (error.message.includes('Insufficient stars')) {
          errorMsg = `You need ${TRAINING_COST} stars to start training. Current balance: ${userInfo?.stars || 0} stars.`;
        } else {
          errorMsg += error.message;
        }
      } else {
        errorMsg += 'Unknown error occurred';
      }

      setErrorMessage(errorMsg);
      setTrainingError(errorMsg);
      window.Telegram?.WebApp?.showPopup({ message: errorMsg });

    } finally {
      setIsLoading(false);
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

        {/* Always render TrainingStatus component, visibility controlled by isTraining prop */}
        <TrainingStatus
          isVisible={isTraining}
          progress={progress}
        />
      </div>
    </Card>
  );
}

export default TrainTab;
import type { TrainingImage } from '../types/training';
import { Loader2 } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { ImagePreviews } from './ImagePreviews';
import { TriggerWordInput } from './TriggerWordInput';
import { TrainingSteps } from './TrainingSteps';
import { TrainingToggles } from './TrainingToggles';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

interface TrainingFormProps {
  isLoading: boolean;
  images: TrainingImage[];
  triggerWord: string;
  steps: number;
  isStyle: boolean;
  createMasks: boolean;
  hasEnoughStars: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onImagesChange: (images: TrainingImage[]) => void;
  onTriggerWordChange: (value: string) => void;
  onStepsChange: (value: number) => void;
  onStyleChange: (value: boolean) => void;
  onMasksChange: (value: boolean) => void;
}

export function TrainingForm({
  isLoading,
  images,
  triggerWord,
  steps,
  isStyle,
  createMasks,
  hasEnoughStars,
  onSubmit,
  onImagesChange,
  onTriggerWordChange,
  onStepsChange,
  onStyleChange,
  onMasksChange,
}: TrainingFormProps) {
  const themeParams = useTelegramTheme();
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const totalSize = images.reduce((acc: number, img: TrainingImage) => acc + img.file.size, 0);

  const buttonStyle = {
    backgroundColor: themeParams.button_color,
    color: themeParams.button_text_color,
  };

  const isFormValid = images.length > 0 && triggerWord.trim().length > 0;
  const buttonDisabled = isLoading || !isFormValid || !hasEnoughStars;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FileUpload
        totalSize={totalSize}
        maxSize={MAX_SIZE}
        onFilesSelected={(newImages: TrainingImage[]) => 
          onImagesChange([...images, ...newImages])
        }
      />

      <ImagePreviews
        images={images}
        onImageRemove={(index: number) => 
          onImagesChange(images.filter((_, i) => i !== index))
        }
        onCaptionUpdate={(index: number, caption: string) =>
          onImagesChange(images.map((img, i) => 
            i === index ? { ...img, caption } : img
          ))
        }
      />

      <TriggerWordInput
        value={triggerWord}
        onChange={onTriggerWordChange}
      />

      <TrainingSteps
        value={steps}
        onChange={onStepsChange}
      />

      <TrainingToggles
        isStyle={isStyle}
        createMasks={createMasks}
        onStyleChange={onStyleChange}
        onMasksChange={onMasksChange}
      />

      <button 
        type="submit"
        className="w-full mt-6 flex items-center justify-center py-3 px-4 text-sm font-semibold rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2"
        style={buttonStyle}
        disabled={buttonDisabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Training...
          </>
        ) : !hasEnoughStars ? (
          'Insufficient Stars'
        ) : !isFormValid ? (
          'Fill Required Fields'
        ) : (
          'Start Training'
        )}
      </button>
    </form>
  );
}
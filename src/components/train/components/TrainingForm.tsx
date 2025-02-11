import type { TrainingImage } from '../types';
import { FileUpload } from './FileUpload';
import { ImagePreviews } from './ImagePreviews';
import { TriggerWordInput } from './TriggerWordInput';
import { TrainingSteps } from './TrainingSteps';
import { TrainingToggles } from './TrainingToggles';
import { Loader2 } from 'lucide-react';
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
  onTriggerWordChange: (word: string) => void;
  onStepsChange: (steps: number) => void;
  onStyleChange: (isStyle: boolean) => void;
  onMasksChange: (createMasks: boolean) => void;
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
  onMasksChange
}: TrainingFormProps) {
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const themeParams = useTelegramTheme();
  const totalSize = images.reduce((acc: number, img: TrainingImage) => acc + img.file.size, 0);

  const buttonStyle = {
    backgroundColor: themeParams.button_color,
    color: themeParams.button_text_color,
  };

  const isFormValid = images.length > 0 && triggerWord.trim().length > 0;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FileUpload
        totalSize={totalSize}
        maxSize={MAX_SIZE}
        onFilesSelected={newImages => 
          onImagesChange([...images, ...newImages])
        }
      />

      <ImagePreviews
        images={images}
        onImageRemove={index => 
          onImagesChange(images.filter((_, i) => i !== index))
        }
        onCaptionUpdate={(index, caption) =>
          onImagesChange(
            images.map((img, i) => i === index ? { ...img, caption } : img)
          )
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
        onStyleChange={val => {
          onStyleChange(val);
          if (val) onMasksChange(false);
        }}
        onMasksChange={onMasksChange}
      />

      <button 
        type="submit" 
        className="w-full py-3 px-4 text-sm font-semibold shadow-sm hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          ...buttonStyle,
          opacity: !hasEnoughStars || !isFormValid ? 0.5 : 1
        }}
        disabled={isLoading || !isFormValid || !hasEnoughStars}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Training Model...
          </div>
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

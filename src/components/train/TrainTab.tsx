import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Upload, X, Edit2 } from 'lucide-react';
import { startTraining, getTrainingProgress, type TrainingProgress, uploadTrainingFiles } from '@/lib/api';
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

interface TrainingResponse {
  id: string;
  trainingId: string;
}

const DEFAULT_STATE: TrainingState = {
  images: [],
  triggerWord: '',
  createMasks: false,
  steps: 1000,
  isStyle: true,
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
      if (!data || data.status === 'COMPLETED' || data.status === 'FAILED') {
        return false;
      }
      return 1000; // Poll every second while training
    },
  });

  // Reset request ID when training completes or fails
  useEffect(() => {
    if (progressData?.status === 'COMPLETED' || progressData?.status === 'FAILED') {
      setRequestId(null);
      setIsLoading(false);
      
      // Show completion message
      window.Telegram?.WebApp?.showPopup({
        message: progressData.status === 'COMPLETED' 
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

      // Upload images first
      const formData = new FormData();
      state.images.forEach((img, index) => {
        formData.append('images', img.file);
        formData.append(`captions[${img.file.name}]`, img.caption);
      });

      const { images_data_url } = await uploadTrainingFiles(formData);

      // Start training
      const { id } = await startTraining({
        steps: state.steps,
        is_style: state.isStyle,
        create_masks: state.createMasks,
        trigger_word: state.triggerWord,
        images_data_url
      });

      setRequestId(id);

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

  // Rest of the component remains the same...
  // (UI rendering code)

  return (
    <Card className="bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Component UI remains the same */}
      </form>
    </Card>
  );
}
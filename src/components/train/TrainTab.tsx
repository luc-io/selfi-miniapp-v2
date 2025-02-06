import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Loader2, Upload, X, Edit2 } from 'lucide-react';
import { 
  startTraining, 
  getTrainingProgress, 
  uploadTrainingFiles,
  type TrainingProgress 
} from '@/lib/api';
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
  createMasks: false,
  steps: 1000,
  isStyle: true,
};

const TrainTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<TrainingState>(DEFAULT_STATE);
  const [dragActive, setDragActive] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Rest of component code...
}

export default TrainTab;
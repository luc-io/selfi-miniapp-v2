// ... previous imports and interfaces

export interface TrainingProgressInfo {
  status: 'pending' | 'training' | 'completed' | 'failed';
  progress: number;
  message?: string;
}

export interface TrainingStatus {
  trainingId: string;
  loraId: string;
  falRequestId: string;  // Add this to match backend
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';
  trainingStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  metadata?: any;
  error?: string;
  completedAt?: string;
  test_mode?: boolean;
  progress?: TrainingProgressInfo | null;
}

// ... rest of the file remains the same
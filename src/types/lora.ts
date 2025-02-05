export interface LoraParameter {
  path: string;
  scale: number;
}

export interface User {
  username: string | null;
}

export interface LoraModel {
  databaseId: string;
  name: string;
  triggerWord: string;
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';
  isPublic: boolean;
  user?: User;
  baseModel?: {
    modelPath: string;
  };
  starsRequired?: number;
  previewImageUrl?: string | null;
}
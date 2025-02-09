export interface LoraParameter {
  path: string;
  scale: number;
}

export interface LoraModel {
  databaseId: string;
  name: string;
  triggerWord: string;
  status: 'PENDING' | 'TRAINING' | 'COMPLETED' | 'FAILED';
  isPublic: boolean;
  isSelected: boolean;
  baseModelId?: string;
  previewImageUrl?: string;
  starsRequired?: number;
  userDatabaseId?: string;
  createdAt?: string;
  updatedAt?: string;
}
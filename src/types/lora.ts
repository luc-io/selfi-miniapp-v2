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
}
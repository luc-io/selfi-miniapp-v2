export * from './telegram';

export interface Model {
  modelPath: string;
}

export interface Generation {
  id: string;
  status: 'pending' | 'success' | 'error';
  modelPath: string;
  params: Record<string, any>;
  result?: {
    url: string;
  };
  error?: string;
}
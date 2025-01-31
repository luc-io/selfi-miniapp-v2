export interface Model {
  id: string;
  name: string;
  type: 'public' | 'private' | 'trained';
}

export interface ModelResponse {
  success: boolean;
  model?: Model;
  error?: string;
}

export interface Generation {
  id: string;
  status: 'pending' | 'success' | 'error';
  model: Model;
  params: Record<string, any>;
  result?: {
    url: string;
  };
  error?: string;
}
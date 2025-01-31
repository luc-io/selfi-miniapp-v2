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
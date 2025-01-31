export interface Model {
  id: string;
  name: string;
  triggerWord: string;
  previewImageUrl?: string;
  starsRequired: number;
  isPublic: boolean;
}

export interface Generation {
  id: string;
  prompt: string;
  negativePrompt?: string;
  imageUrl: string;
  seed?: number;
  starsUsed: number;
  createdAt: string;
  model?: Model;
}

export interface TelegramWebApp {
  showPopup: (params: { title: string; message: string }) => void;
  close: () => void;
  ready: () => void;
  expand: () => void;
}
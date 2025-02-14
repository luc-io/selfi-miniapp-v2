import type { GeneratedImage } from '@/types/image';
import type { LoraParameter } from '@/types/lora';

export interface ImageThumbnailProps {
  src: string;
  alt: string;
  onClick: () => void;
  themeParams: any;
}

export interface ImageGalleryProps {
  images: GeneratedImage[];
  onClose: () => void;
  initialImageId: string;
  onImageClick: (imageId: string) => void;
}

export interface ImageListItemProps {
  image: GeneratedImage;
  themeParams: any;
  images: GeneratedImage[];
  onImageClick: (imageId: string) => void;
}

export interface StoredLora extends LoraParameter {
  triggerWord?: string;
}
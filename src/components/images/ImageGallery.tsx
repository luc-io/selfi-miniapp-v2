import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { ImageGalleryProps } from './types';

export function ImageGallery({ 
  images, 
  onClose, 
  initialImageId,
  onImageClick 
}: ImageGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (scrollContainerRef.current) {
      const initialElement = scrollContainerRef.current.querySelector(`[data-gallery-id="${initialImageId}"]`);
      if (initialElement) {
        initialElement.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    }
  }, [initialImageId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleImageClick = (imageId: string) => {
    onImageClick(imageId);
    requestAnimationFrame(() => {
      onClose();
      setTimeout(() => {
        const element = document.querySelector(`[data-image-id="${imageId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    });
  };

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex flex-col"
      onClick={onClose}
    >
      <div 
        ref={scrollContainerRef}
        className="flex flex-col w-full h-full overflow-y-auto py-4 snap-y snap-mandatory"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((image) => (
          <div
            key={image.id}
            data-gallery-id={image.id}
            className="flex-shrink-0 w-full h-full flex items-center justify-center p-4 snap-center cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick(image.id);
            }}
          >
            {!loadedImages.has(image.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/10">
                <Loader2 className="h-8 w-8 animate-spin text-white/50" />
              </div>
            )}
            <img 
              src={image.url}
              alt={image.prompt}
              onLoad={() => handleImageLoad(image.id)}
              className={`max-w-full max-h-[calc(100vh-2rem)] object-contain rounded select-none transition-opacity duration-200 ${
                loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
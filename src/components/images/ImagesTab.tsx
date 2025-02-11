import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '../ui/card';
import { Loader2, Copy } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import type { GeneratedImage } from '@/types/image';
import { getGeneratedImages, type ImagesResponse } from '@/api/images';
import { useInfiniteQuery } from '@tanstack/react-query';

interface ImageItemProps {
  image: GeneratedImage;
  themeParams: any;
  images: GeneratedImage[];
  onImageClick: (imageId: string) => void;
}

const ITEMS_PER_PAGE = 20;

// ... other utility functions remain the same ...

const ImageGallery = ({ 
  images, 
  onClose, 
  initialImageId,
  onImageChange 
}: { 
  images: GeneratedImage[], 
  onClose: () => void,
  initialImageId: string,
  onImageChange: (imageId: string) => void 
}) => {
  const [currentImageId, setCurrentImageId] = useState(initialImageId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollContainerRef.current) {
      const initialElement = scrollContainerRef.current.querySelector(`[data-image-id="${initialImageId}"]`);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const imageId = entry.target.getAttribute('data-image-id');
            if (imageId && imageId !== currentImageId) {
              setCurrentImageId(imageId);
              onImageChange(imageId);
            }
          }
        });
      },
      {
        threshold: 0.7,
        root: scrollContainerRef.current
      }
    );

    const elements = scrollContainerRef.current?.querySelectorAll('[data-image-id]') || [];
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [currentImageId, onImageChange]);

  const handleImageClick = (imageId: string) => {
    onImageChange(imageId);
    requestAnimationFrame(() => {
      onClose();
    });
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
            data-image-id={image.id}
            className="flex-shrink-0 w-full h-full flex items-center justify-center p-4 snap-center cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick(image.id);
            }}
          >
            <img 
              src={image.url}
              alt={image.prompt}
              className="max-w-full max-h-[calc(100vh-2rem)] object-contain rounded select-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageItem = ({ image, themeParams, images, onImageClick }: ImageItemProps) => {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const command = generateCommand(image);

  const itemStyle = {
    borderColor: `${themeParams.button_color}20`,
  };

  const commandStyle = {
    backgroundColor: `${themeParams.button_color}10`,
  };

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleImageClick = () => {
    setShowGallery(true);
    // When opening gallery, scroll to this item to ensure proper position tracking
    itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleGalleryClose = useCallback(() => {
    setShowGallery(false);
    // Use setTimeout to ensure gallery is removed from DOM before scrolling
    setTimeout(() => {
      itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, []);

  return (
    <div 
      ref={itemRef}
      data-image-id={image.id}
      className="border-b last:border-b-0 py-4 px-4"
      style={itemStyle}
    >
      {/* ... rest of the ImageItem content stays the same ... */}
      {showGallery && (
        <ImageGallery 
          images={images}
          onClose={handleGalleryClose}
          initialImageId={image.id}
          onImageChange={(newImageId) => {
            // Delay to ensure DOM updates
            setTimeout(() => {
              const targetElement = document.querySelector(`[data-image-id="${newImageId}"]`);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 50);
          }}
        />
      )}
    </div>
  );
};

export function ImagesTab() {
  const themeParams = useTelegramTheme();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // ... rest of the ImagesTab implementation stays the same ...

  const handleImageClick = useCallback((imageId: string) => {
    setTimeout(() => {
      const imageElement = document.querySelector(`[data-image-id="${imageId}"]`);
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  }, []);

  // ... rest of the ImagesTab implementation stays the same ...
}
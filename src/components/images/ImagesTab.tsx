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

// ... [formatDateLatam and generateCommand functions remain unchanged]

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
    // Find and scroll to initial image
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

  // Use Intersection Observer to track visible images
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
    onClose();
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
            className="flex-shrink-0 w-full h-full flex items-center justify-center p-4 snap-center"
          >
            <img 
              src={image.url}
              alt={image.prompt}
              className="max-w-full max-h-[calc(100vh-2rem)] object-contain rounded select-none cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(image.id);
              }}
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
    onImageClick(image.id);
  };

  const handleGalleryClose = () => {
    setShowGallery(false);
    itemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div 
      ref={itemRef}
      data-image-id={image.id}
      className="border-b last:border-b-0 py-4 px-4"
      style={itemStyle}
    >
      {/* ... rest of ImageItem content remains unchanged ... */}
    </div>
  );
};

export function ImagesTab() {
  const themeParams = useTelegramTheme();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: async ({ pageParam }) => {
      return getGeneratedImages({
        page: pageParam,
        limit: ITEMS_PER_PAGE
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ImagesResponse, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length + 1;
    }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleImageClick = useCallback((imageId: string) => {
    const imageElement = document.querySelector(`[data-image-id="${imageId}"]`);
    if (imageElement) {
      imageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  if (isLoading) {
    return (
      <Card className="shadow-md" style={cardStyle}>
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: themeParams.button_color }} />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="shadow-md" style={cardStyle}>
        <div className="p-6 text-center">
          <p className="text-sm text-red-500">
            Error loading images: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

  const allImages = data?.pages.flatMap(page => page.images) ?? [];

  return (
    <Card className="shadow-md" style={cardStyle}>
      <div className="divide-y">
        {allImages.map((image) => (
          <ImageItem 
            key={image.id}
            image={image}
            themeParams={themeParams}
            images={allImages}
            onImageClick={handleImageClick}
          />
        ))}
        
        {allImages.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm" style={{ color: themeParams.hint_color }}>
              No images generated yet. Go to the Generate tab to create some!
            </p>
          </div>
        ) : (
          <div 
            ref={loadMoreRef} 
            className="p-4 flex justify-center"
          >
            {isFetchingNextPage && (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
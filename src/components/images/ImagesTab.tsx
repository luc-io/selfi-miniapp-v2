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

const formatDateLatam = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return date.toLocaleDateString('es-AR', options);
};

const generateCommand = (image: GeneratedImage): string => {
  const parts = ['/gen', image.prompt];
  
  if (image.width && image.height) {
    const ar = image.width === image.height ? '1:1' : '16:9';
    parts.push(`--ar ${ar}`);
  }
  if (image.params?.num_inference_steps) parts.push(`--s ${image.params.num_inference_steps}`);
  if (image.params?.guidance_scale) parts.push(`--c ${image.params.guidance_scale}`);
  if (typeof image.seed === 'number' && !isNaN(image.seed)) {
    parts.push(`--seed ${image.seed}`);
  }
  if (image.loras?.[0]) {
    const lora = image.loras[0];
    parts.push(`--l ${lora.triggerWord || lora.name}:${lora.scale}`);
  }
  
  return parts.join(' ');
};

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
      <div className="space-y-2">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-gray-500">
                {formatDateLatam(new Date(image.createdAt))}
              </span>
              <button
                onClick={copyCommand}
                className="p-1 hover:bg-gray-100 rounded group relative"
                title="Copy command"
              >
                <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                {showCopied && (
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                    Copied!
                  </span>
                )}
              </button>
            </div>
            <div className="mt-1">
              <div className="flex items-start gap-2">
                <span className={`text-sm ${!isPromptExpanded ? "line-clamp-1" : ""}`}>
                  {image.prompt}
                </span>
                {image.prompt.length > 50 && (
                  <button
                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                    className="text-xs text-gray-500 hover:text-gray-700 shrink-0 mt-0.5"
                  >
                    {isPromptExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
              <div className="mt-1">
                <code 
                  className="text-xs font-mono break-all rounded px-2 py-1 block w-full"
                  style={commandStyle}
                >
                  {command}
                </code>
              </div>
            </div>
          </div>
          <button 
            onClick={handleImageClick}
            className="w-20 h-20 relative shrink-0 rounded overflow-hidden hover:opacity-90 transition-opacity"
          >
            <img 
              src={image.url} 
              alt={image.prompt}
              className="object-cover w-full h-full"
            />
          </button>
        </div>
      </div>

      {showGallery && (
        <ImageGallery 
          images={images}
          onClose={handleGalleryClose}
          initialImageId={image.id}
          onImageChange={onImageClick}
        />
      )}
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
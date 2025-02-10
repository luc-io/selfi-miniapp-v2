import { useState } from 'react';
import { Card } from '../ui/card';
import { ChevronDown, ChevronUp, Loader2, Copy } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import type { GeneratedImage } from '@/types/image';
import { getGeneratedImages, type ImagesResponse } from '@/api/images';
import { useInfiniteQuery } from '@tanstack/react-query';

interface ImageItemProps {
  image: GeneratedImage;
  themeParams: any;
}

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
  if (image.params.num_inference_steps) parts.push(`--s ${image.params.num_inference_steps}`);
  if (image.params.guidance_scale) parts.push(`--c ${image.params.guidance_scale}`);
  if (image.seed) parts.push(`--seed ${image.seed}`);
  if (image.loras?.[0]) {
    const lora = image.loras[0];
    parts.push(`--l ${lora.triggerWord || lora.name}:${lora.scale}`);
  }
  
  return parts.join(' ');
};

const ImageItem = ({ image, themeParams }: ImageItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const command = generateCommand(image);

  const itemStyle = {
    borderColor: `${themeParams.button_color}20`,
  };

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div 
      className="border-b last:border-b-0 py-4"
      style={itemStyle}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {formatDateLatam(new Date(image.createdAt))}
              </span>
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
              <div className="mt-1 flex items-center gap-2">
                <code className="text-xs text-gray-600 font-mono break-all bg-gray-100 rounded px-1 py-0.5">
                  {command}
                </code>
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
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 relative shrink-0">
              <img 
                src={image.url} 
                alt={image.prompt}
                className="object-cover w-full h-full rounded"
              />
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-black/5 rounded shrink-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-2 pl-4">
          <img 
            src={image.url}
            alt={image.prompt}
            className="max-w-full h-auto rounded mb-4"
          />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Prompt:</strong> {image.prompt}</p>
              <p><strong>Seed:</strong> {image.seed}</p>
              {image.width && image.height && (
                <p><strong>Size:</strong> {image.width}x{image.height}</p>
              )}
              <p><strong>NSFW Check:</strong> {image.hasNsfw ? 'Failed' : 'Passed'}</p>
            </div>
            <div>
              <p><strong>Steps:</strong> {image.params.num_inference_steps}</p>
              <p><strong>CFG Scale:</strong> {image.params.guidance_scale}</p>
              {image.loras && image.loras.length > 0 && (
                <div>
                  <strong>LoRAs:</strong>
                  <ul className="list-disc pl-4">
                    {image.loras.map((lora, index) => (
                      <li key={index}>
                        {lora.name || lora.triggerWord || lora.path} 
                        {lora.scale && ` (scale: ${lora.scale})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ITEMS_PER_PAGE = 10;

export function ImagesTab() {
  const themeParams = useTelegramTheme();

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

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const buttonStyle = {
    backgroundColor: themeParams.button_color,
    color: themeParams.button_text_color,
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
          />
        ))}
        
        {allImages.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm" style={{ color: themeParams.hint_color }}>
              No images generated yet. Go to the Generate tab to create some!
            </p>
          </div>
        ) : hasNextPage && (
          <div className="p-4 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="py-2 px-4 text-sm font-medium rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={buttonStyle}
            >
              {isFetchingNextPage ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
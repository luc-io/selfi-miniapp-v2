import { useState } from 'react';
import { Card } from '../ui/card';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import type { GeneratedImage } from '@/types/image';
import { getGeneratedImages, type ImagesResponse } from '@/api/images';
import { formatDate } from '@/utils/date';
import { useInfiniteQuery } from '@tanstack/react-query';

interface ImageItemProps {
  image: GeneratedImage;
  themeParams: any;
}

const ImageItem = ({ image, themeParams }: ImageItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemStyle = {
    borderColor: `${themeParams.button_color}20`,
  };

  return (
    <div 
      className="border-b last:border-b-0 py-4"
      style={itemStyle}
    >
      <div className="flex items-center space-x-4">
        <span className="text-sm">
          {formatDate(new Date(image.createdAt))}
        </span>
        <div className="flex-1 truncate">
          <span className="text-sm font-medium">
            {image.prompt}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          Seed: {image.seed}
        </span>
        <div className="w-16 h-16 relative">
          <img 
            src={image.url} 
            alt={image.prompt}
            className="object-cover w-full h-full rounded"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-black/5 rounded"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
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
              <p><strong>Size:</strong> {image.width}x{image.height}</p>
              <p><strong>NSFW Check:</strong> {image.hasNsfw ? 'Failed' : 'Passed'}</p>
            </div>
            <div>
              <p><strong>Steps:</strong> {image.params.num_inference_steps}</p>
              <p><strong>CFG Scale:</strong> {image.params.guidance_scale}</p>
              <p><strong>Model:</strong> {image.params.modelPath}</p>
              {image.loras && image.loras.length > 0 && (
                <div>
                  <strong>LoRAs:</strong>
                  <ul className="list-disc pl-4">
                    {image.loras.map((lora, index) => (
                      <li key={index}>
                        {lora.path} (scale: {lora.scale})
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
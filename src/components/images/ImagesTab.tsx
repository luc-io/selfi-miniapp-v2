import { useState } from 'react';
import { Card } from '../ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import type { GeneratedImage } from '@/types/image';
import { formatDate } from '@/utils/date';

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

export function ImagesTab() {
  const themeParams = useTelegramTheme();

  // TODO: Add React Query hook for fetching images
  const images: GeneratedImage[] = [];
  const isLoading = false;

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  if (isLoading) {
    return (
      <Card className="shadow-md" style={cardStyle}>
        <div className="p-6">
          Loading...
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-md" style={cardStyle}>
      <div className="divide-y">
        {images.map((image) => (
          <ImageItem 
            key={image.id}
            image={image}
            themeParams={themeParams}
          />
        ))}
        {images.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-sm" style={{ color: themeParams.hint_color }}>
              No images generated yet. Go to the Generate tab to create some!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
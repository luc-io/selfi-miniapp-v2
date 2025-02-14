import { useState, useRef } from 'react';
import { Copy } from 'lucide-react';
import { ImageThumbnail } from './ImageThumbnail';
import { ImageGallery } from './ImageGallery';
import type { ImageListItemProps } from './types';
import { generateCommand } from './utils/commandGenerator';
import { formatDateLatam } from './utils/dateFormatter';

export function ImageListItem({ image, themeParams, images, onImageClick }: ImageListItemProps) {
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
  };

  const handleGalleryClose = () => {
    setShowGallery(false);
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
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
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
              <button
                onClick={copyCommand}
                className="p-1 hover:bg-gray-100 rounded group relative shrink-0 mt-0.5"
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
              <code 
                className="text-xs font-mono break-all rounded px-2 py-1 block w-full"
                style={commandStyle}
              >
                {command}
              </code>
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-500">
                {formatDateLatam(new Date(image.createdAt))}
              </span>
            </div>
          </div>
          <ImageThumbnail
            src={image.url}
            alt={image.prompt}
            onClick={handleImageClick}
            themeParams={themeParams}
          />
        </div>
      </div>

      {showGallery && (
        <ImageGallery 
          images={images}
          onClose={handleGalleryClose}
          initialImageId={image.id}
          onImageClick={onImageClick}
        />
      )}
    </div>
  );
}
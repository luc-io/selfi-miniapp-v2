import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { ImageThumbnailProps } from './types';

export function ImageThumbnail({ 
  src, 
  alt,
  onClick,
  themeParams 
}: ImageThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <button 
      onClick={onClick}
      className="w-20 h-20 relative shrink-0 rounded overflow-hidden hover:opacity-90 transition-opacity bg-gray-100/10"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 
            className="h-5 w-5 animate-spin" 
            style={{ color: themeParams.button_color }}
          />
        </div>
      )}
      <img 
        ref={imageRef}
        src={src} 
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`object-cover w-full h-full transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  );
}
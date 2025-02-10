import React from 'react';
import { X } from 'lucide-react';
import { ImagePreviewsProps } from './types';

export const ImagePreviews: React.FC<ImagePreviewsProps> = ({ 
  images, 
  onImageRemove, 
  onCaptionUpdate,
  disabled = false 
}) => {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={URL.createObjectURL(image.file)}
            alt={`Preview ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg"
          />
          <button
            onClick={() => !disabled && onImageRemove(index)}
            className={`absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
              hover:bg-red-600 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
          <textarea
            value={image.caption}
            onChange={(e) => !disabled && onCaptionUpdate(index, e.target.value)}
            placeholder="Add caption..."
            className={`mt-2 w-full text-sm p-2 border rounded-md ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            rows={2}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
};
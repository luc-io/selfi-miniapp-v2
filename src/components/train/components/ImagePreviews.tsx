import { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import type { TrainingImage } from '../types/training';

interface ImagePreviewsProps {
  images: TrainingImage[];
  onImageRemove: (index: number) => void;
  onCaptionUpdate: (index: number, caption: string) => void;
}

export const ImagePreviews: React.FC<ImagePreviewsProps> = ({
  images,
  onImageRemove,
  onCaptionUpdate
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((img, index) => (
        <div key={index} className="relative group space-y-1">
          <div className="relative">
            <img
              src={URL.createObjectURL(img.file)}
              alt={`Upload ${index + 1}`}
              className="w-full h-24 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => onImageRemove(index)}
              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {editingIndex === index ? (
            <input
              type="text"
              value={img.caption}
              onChange={(e) => onCaptionUpdate(index, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingIndex(null)}
              autoFocus
              className="w-full text-xs px-1 py-0.5 border rounded"
            />
          ) : (
            <div 
              className="flex items-center space-x-1 group/caption cursor-pointer"
              onClick={() => setEditingIndex(index)}
            >
              <p className="text-xs text-gray-500 truncate flex-1">
                {img.caption}
              </p>
              <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover/caption:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
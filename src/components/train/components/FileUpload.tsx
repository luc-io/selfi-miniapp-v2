import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUploadProps } from './types';
import { type TrainingImage } from '../types/training';

export const FileUpload: React.FC<FileUploadProps> = ({ 
  totalSize, 
  maxSize, 
  onFilesSelected,
  disabled = false 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (disabled) return;
    
    const newImages: TrainingImage[] = acceptedFiles.map(file => ({
      file,
      caption: ''
    }));
    onFilesSelected(newImages);
  }, [onFilesSelected, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxSize: maxSize - totalSize,
    disabled
  });

  const remainingSize = maxSize - totalSize;
  const remainingSizeMB = Math.round(remainingSize / (1024 * 1024));

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-blue-50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <ImageIcon className="w-8 h-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>
                Drag & drop images here, or click to select
                <br />
                <span className="text-xs">
                  Remaining space: {remainingSizeMB}MB
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {totalSize > maxSize && (
        <Alert variant="destructive">
          <AlertDescription>
            Total file size exceeds the maximum allowed ({maxSize / (1024 * 1024)}MB)
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import type { TrainingImage } from '../types/training';

interface FileUploadProps {
  totalSize: number;
  maxSize: number;
  onFilesSelected: (files: TrainingImage[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  totalSize,
  maxSize,
  onFilesSelected
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files);
    const newTotalSize = totalSize + imageFiles.reduce((acc, file) => acc + file.size, 0);

    if (newTotalSize > maxSize) {
      window.Telegram?.WebApp?.showPopup({
        message: 'Total file size must be less than 50MB'
      });
      return;
    }

    const newImages = imageFiles.map(file => ({
      file,
      caption: file.name.replace(/\.[^/.]+$/, '') // Remove extension
    }));

    onFilesSelected(newImages);
  }, [totalSize, maxSize, onFilesSelected]);

  return (
    <div 
      className={`mt-1 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
    >
      <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-8 h-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-600">
            Drop images here or click to browse
          </span>
          <span className="mt-1 text-xs text-gray-500">
            {((totalSize / 1024 / 1024).toFixed(1))} MB of 50 MB used
          </span>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>
    </div>
  );
};
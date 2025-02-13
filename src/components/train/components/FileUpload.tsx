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
        message: 'El tamaño total del archivo debe ser menor a 50MB'
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
      className={`mt-1 ${dragActive ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
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
      <label className="flex justify-center w-full h-32 px-4 transition bg-card border-2 border-dashed border-border appearance-none cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="mt-2 text-sm text-card-foreground">
            Suelta imágenes aquí o haz clic para explorar
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            {((totalSize / 1024 / 1024).toFixed(1))} MB de 50 MB usados
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
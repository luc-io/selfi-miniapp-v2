import { useState, useRef } from 'react';
import { Copy, Trash2, Loader2 } from 'lucide-react';
import { ImageThumbnail } from './ImageThumbnail';
import { ImageGallery } from './ImageGallery';
import type { ImageListItemProps } from './types';
import { generateCommand } from './utils/commandGenerator';
import { formatDateLatam } from './utils/dateFormatter';
import { useLongPress } from '@/hooks/useLongPress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ImageListItem({ image, themeParams, images, onImageClick }: ImageListItemProps) {
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const command = generateCommand(image);

  const itemStyle = {
    borderColor: `${themeParams.button_color}20`,
  };

  const commandStyle = {
    backgroundColor: `${themeParams.button_color}10`,
  };

  const { handlers } = useLongPress({
    onFinish: () => setShowDelete(true),
    onCancel: () => {
      // Only cancel if we haven't shown the delete button yet
      if (!showDelete) {
        setShowDelete(false);
      }
    },
  });

  const copyCommand = async () => {
    await navigator.clipboard.writeText(command);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleImageClick = () => {
    if (!showDelete) {
      setShowGallery(true);
    }
  };

  const handleGalleryClose = () => {
    setShowGallery(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // TODO: Call delete API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      // TODO: Show success toast
    } catch (error) {
      // TODO: Show error toast
      console.error('Error deleting image:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setShowDelete(false);
    }
  };

  return (
    <>
      <div 
        ref={itemRef}
        data-image-id={image.id}
        className="border-b last:border-b-0 py-4 px-4 relative"
        style={itemStyle}
        {...handlers}
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
                      className="text-xs hover:opacity-80 shrink-0 mt-0.5"
                      style={{ color: themeParams.button_color }}
                    >
                      {isPromptExpanded ? 'Mostrar menos' : 'Mostrar más'}
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyCommand}
                    className="p-1 hover:opacity-80 rounded group relative shrink-0 mt-0.5"
                    title="Copiar comando"
                  >
                    <Copy className="h-4 w-4" style={{ color: themeParams.hint_color }} />
                    {showCopied && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 py-1 px-2 rounded text-xs"
                        style={{ 
                          backgroundColor: themeParams.hint_color,
                          color: themeParams.bg_color 
                        }}
                      >
                        ¡Copiado!
                      </span>
                    )}
                  </button>
                  {showDelete && (
                    <button
                      onClick={handleDeleteClick}
                      className="p-1 hover:opacity-80 rounded group relative shrink-0 mt-0.5"
                      title="Eliminar imagen"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
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
                <span className="text-xs" style={{ color: themeParams.hint_color }}>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent style={{ 
          backgroundColor: themeParams.bg_color,
          color: themeParams.text_color,
          borderColor: `${themeParams.button_color}20`
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: themeParams.hint_color }}>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{ 
                backgroundColor: 'transparent',
                borderColor: `${themeParams.button_color}60`,
                color: themeParams.button_color
              }}
              onClick={() => {
                setShowDeleteDialog(false);
                setShowDelete(false);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              style={{ 
                backgroundColor: '#ef4444',
                color: 'white'
              }}
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
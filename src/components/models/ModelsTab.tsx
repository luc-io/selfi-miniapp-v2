import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Info, Trash2, ChevronRight, Download, Loader2 } from 'lucide-react';
import { Model } from '@/types/model';
import { useModels } from '@/hooks/useModels';
import { Switch } from '@/components/ui/switch';

export function ModelsTab() {
  const { 
    models, 
    isLoading, 
    toggleActivation, 
    isToggling,
    deleteModel,
    isDeleting,
    downloadConfig 
  } = useModels();

  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleDelete = async (model: Model) => {
    try {
      await deleteModel(model.id);
      setModelToDelete(null);
      window.Telegram?.WebApp?.showPopup({
        message: `Model ${model.name} deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      window.Telegram?.WebApp?.showPopup({
        message: 'Failed to delete model. Please try again.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!models?.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No models found. Train a model to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold">Your Models</h2>
        <button 
          className="flex items-center px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50"
          onClick={() => {
            window.Telegram?.WebApp?.showPopup({
              message: 'You can manage your trained models here. Toggle them on/off, view details, or delete them.'
            });
          }}
        >
          <Info className="w-4 h-4 mr-2" />
          Help
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div key={model.id} className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{model.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created {formatDistanceToNow(new Date(model.createdAt))} ago
                  </p>
                </div>
                <Switch 
                  checked={model.isActive}
                  onCheckedChange={(checked) => {
                    toggleActivation({ modelId: model.id, isActive: checked });
                  }}
                  disabled={isToggling}
                />
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Model Size: {formatFileSize(model.diffusers_lora_file.file_size)}</span>
                  <button 
                    onClick={() => setSelectedModel(selectedModel?.id === model.id ? null : model)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                    onClick={() => downloadConfig(model.id, model.config_file.file_name)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Config
                  </button>
                  <button 
                    className="flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                    onClick={() => setModelToDelete(model)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {selectedModel?.id === model.id && (
              <div className="border-t">
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Configuration File</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {JSON.stringify(model.config_file, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Model File</h4>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                        {JSON.stringify(model.diffusers_lora_file, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {modelToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-2">Delete Model</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete &quot;{modelToDelete.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                onClick={() => setModelToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={() => handleDelete(modelToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
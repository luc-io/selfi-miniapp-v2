import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Loader2, Trash2 } from 'lucide-react';
import { Model, LoraStatus } from '@/types/model';
import { useModels } from '@/hooks/useModels';
import { Switch } from '@/components/ui/switch';

const STATUS_COLORS: Record<LoraStatus, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-gray-100', text: 'text-gray-700' },
  TRAINING: { bg: 'bg-blue-100', text: 'text-blue-700' },
  COMPLETED: { bg: 'bg-green-100', text: 'text-green-700' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-700' }
};

export function ModelsTab() {
  const { 
    models, 
    isLoading, 
    toggleActivation, 
    isToggling,
    deleteModel,
    isDeleting,
  } = useModels();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);

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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">
          <div>Model</div>
          <div>Trigger Word</div>
          <div>Status</div>
          <div className="w-24">Actions</div>
        </div>

        {/* List */}
        <div className="divide-y">
          {models.map((model) => (
            <div key={model.id} className="text-sm">
              <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 px-4 py-3 items-center">
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    Created {formatDistanceToNow(new Date(model.createdAt))} ago
                  </div>
                </div>
                <div className="text-gray-600 font-mono">{model.triggerWord}</div>
                <div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[model.status].bg} ${STATUS_COLORS[model.status].text}`}>
                    {model.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={model.isActive}
                    onCheckedChange={(checked) => {
                      toggleActivation({ modelId: model.id, isActive: checked });
                    }}
                    disabled={isToggling || model.status !== 'COMPLETED'}
                  />
                  <button 
                    onClick={() => setExpandedId(expandedId === model.id ? null : model.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedId === model.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === model.id && (
                <div className="px-4 py-3 bg-gray-50 -mt-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-xs uppercase text-gray-500">Model Files</h4>
                      <div className="bg-white p-4 rounded border text-xs space-y-4">
                        <div>
                          <div className="font-medium mb-1">Config File</div>
                          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(model.config_file, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Model Weights</div>
                          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(model.diffusers_lora_file, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setModelToDelete(model)}
                        className="flex items-center px-3 py-1.5 text-xs font-medium text-red-600 rounded border border-red-200 hover:bg-red-50"
                        disabled={isDeleting || model.status === 'TRAINING'}
                      >
                        <Trash2 className="h-3 w-3 mr-1.5" />
                        Delete Model
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
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
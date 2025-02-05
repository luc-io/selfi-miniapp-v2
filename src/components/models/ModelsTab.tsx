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

type DetailsTab = 'input' | 'output';

export function ModelsTab() {
  const { 
    models, 
    isLoading, 
    toggleActivation, 
    isToggling,
    deleteModel,
    isDeleting,
  } = useModels();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [activeTab, setActiveTab] = useState<DetailsTab>('input');

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
        <p className="text-gray-400">No models found. Train a model to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr,minmax(100px,1fr),80px] gap-4 px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">
          <div>Model</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* List */}
        <div className="divide-y">
          {models.map((model) => (
            <div key={model.id} className="text-sm">
              <div className="grid grid-cols-[2fr,minmax(100px,1fr),80px] gap-4 px-4 py-3 items-center">
                <div>
                  <div className="font-medium font-mono">{model.name}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">
                    about {formatDistanceToNow(new Date(model.createdAt))} ago
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[model.status].bg} ${STATUS_COLORS[model.status].text}`}>
                    {model.status}
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-2">
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
                <div className="px-4 pt-0 pb-3 bg-gray-50 -mt-2">
                  <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex space-x-4 border-b">
                      <button
                        className={`px-4 py-2 text-sm font-medium -mb-px ${
                          activeTab === 'input'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('input')}
                      >
                        Input
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium -mb-px ${
                          activeTab === 'output'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('output')}
                      >
                        Output
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div>
                      {activeTab === 'input' ? (
                        <div className="bg-white p-4 rounded border text-xs">
                          <div className="font-medium mb-2">Training Parameters</div>
                          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify({
                              steps: model.input.steps,
                              is_style: model.input.is_style,
                              create_masks: model.input.create_masks,
                              trigger_word: model.input.trigger_word,
                            }, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded border text-xs space-y-4">
                          {model.config_file && (
                            <div>
                              <div className="font-medium mb-1">Config File</div>
                              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(model.config_file, null, 2)}
                              </pre>
                            </div>
                          )}
                          {model.diffusers_lora_file && (
                            <div>
                              <div className="font-medium mb-1">Model Weights</div>
                              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                                {JSON.stringify(model.diffusers_lora_file, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
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
              Are you sure you want to delete "{modelToDelete.name}"? This action cannot be undone.
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
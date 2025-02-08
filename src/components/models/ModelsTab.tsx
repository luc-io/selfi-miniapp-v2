import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Loader2, Trash2 } from 'lucide-react';
import { Model, LoraStatus } from '@/types/model';
import { useModels } from '@/hooks/useModels';
import { Switch } from '@/components/ui/switch';

const STATUS_COLORS: Record<LoraStatus, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-muted', text: 'text-muted-foreground' },
  TRAINING: { bg: 'bg-primary/20', text: 'text-primary' },
  COMPLETED: { bg: 'bg-emerald-400/20', text: 'text-emerald-400' },
  FAILED: { bg: 'bg-destructive/20', text: 'text-destructive' }
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
    if (!model?.databaseId) {
      console.error('No model ID provided for deletion');
      window.Telegram?.WebApp?.showPopup({
        message: 'Invalid model data. Please try again.'
      });
      return;
    }
    try {
      await deleteModel(model.databaseId);
      setModelToDelete(null);
      window.Telegram?.WebApp?.showPopup({
        message: `Model ${model.name} deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      window.Telegram?.WebApp?.showPopup({
        message: error instanceof Error 
          ? `Failed to delete model: ${error.message}`
          : 'Failed to delete model. Please try again.'
      });
    }
  };

  const getTrainingInputParams = (model: Model) => {
    if (!model.training) return null;
    return {
      steps: model.training.steps,
      is_style: model.training.is_style ?? false,
      create_masks: model.training.create_masks ?? false,
      trigger_word: model.training.trigger_word ?? model.triggerWord,
      images_data_url: model.training.imageUrls?.[0] ?? null
    };
  };

  const getTrainingOutputParams = (model: Model) => {
    if (!model.training?.metadata) return null;
    return {
      steps: model.training.steps,
      metadata: model.training.metadata
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!models?.length) {
    return (
      <div className="text-center py-12 bg-card rounded shadow-md">
        <p className="text-muted-foreground">No models found. Train a model to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card shadow-md">
        {/* Header */}
        <div className="grid grid-cols-[2fr,minmax(100px,1fr),80px] gap-4 px-4 py-3 bg-muted font-medium text-sm text-card-foreground border-b border-border">
          <div>Model</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* List */}
        <div className="divide-y divide-border">
          {models.map((model) => (
            <div key={model.databaseId} className="text-sm">
              <div className="grid grid-cols-[2fr,minmax(100px,1fr),80px] gap-4 px-4 py-3 items-center">
                <div>
                  <div className="font-medium font-mono text-card-foreground">{model.name}</div>
                  <div className="text-muted-foreground text-[11px] mt-0.5">
                    about {formatDistanceToNow(new Date(model.createdAt))} ago
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[model.status].bg} ${STATUS_COLORS[model.status].text}`}>
                    {model.status}
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <Switch 
                    checked={model.isPublic}
                    onCheckedChange={(checked) => {
                      toggleActivation({ modelId: model.databaseId, isActive: checked });
                    }}
                    disabled={isToggling || model.status !== 'COMPLETED'}
                  />
                  <button 
                    onClick={() => setExpandedId(expandedId === model.databaseId ? null : model.databaseId)}
                    className="p-1 hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                  >
                    {expandedId === model.databaseId ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === model.databaseId && (
                <div className="px-4 pt-0 pb-3 bg-muted/50 -mt-2">
                  <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex space-x-4 border-b border-border">
                      <button
                        className={`px-4 py-2 text-sm font-medium -mb-px ${
                          activeTab === 'input'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-card-foreground'
                        }`}
                        onClick={() => setActiveTab('input')}
                      >
                        Input
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium -mb-px ${
                          activeTab === 'output'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-card-foreground'
                        }`}
                        onClick={() => setActiveTab('output')}
                      >
                        Output
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div>
                      {activeTab === 'input' ? (
                        <div className="bg-card p-4 border border-border text-xs">
                          <div className="font-medium mb-2 text-card-foreground">Training Parameters</div>
                          {model.training ? (
                            <pre className="bg-muted p-2 text-muted-foreground overflow-x-auto">
                              {JSON.stringify(getTrainingInputParams(model), null, 2)}
                            </pre>
                          ) : (
                            <p className="text-muted-foreground">No training parameters available</p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-card p-4 border border-border text-xs space-y-4">
                          {model.training?.metadata && (
                            <div>
                              <div className="font-medium mb-1 text-card-foreground">Training Result</div>
                              <pre className="bg-muted p-2 text-muted-foreground overflow-x-auto">
                                {JSON.stringify(getTrainingOutputParams(model), null, 2)}
                              </pre>
                            </div>
                          )}
                          {!model.training?.metadata && (
                            <p className="text-muted-foreground">No output data available</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setModelToDelete(model)}
                        className="flex items-center px-3 py-1.5 text-xs font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isDeleting || model.status === 'TRAINING'}
                      >
                        <Trash2 className="h-3 w-3 mr-1.5" />
                        {isDeleting ? 'Deleting...' : 'Delete Model'}
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 max-w-md w-full mx-4 border border-border shadow-lg">
            <h3 className="text-lg font-medium mb-2 text-card-foreground">Delete Model</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete "{modelToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium border border-border text-card-foreground hover:bg-accent"
                onClick={() => setModelToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 disabled:opacity-50"
                onClick={() => handleDelete(modelToDelete)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
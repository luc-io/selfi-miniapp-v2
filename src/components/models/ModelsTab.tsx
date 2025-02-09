import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Loader2, Trash2 } from 'lucide-react';
import { Model, LoraStatus } from '@/types/model';
import { useModels } from '@/hooks/useModels';
import { Switch } from '@/components/ui/switch';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

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
  const themeParams = useTelegramTheme();

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

  const mainStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
  };

  const headerStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const tabStyle = (isActive: boolean) => ({
    color: isActive ? themeParams.button_color : themeParams.hint_color,
    borderColor: isActive ? themeParams.button_color : 'transparent',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 
          className="h-8 w-8 animate-spin" 
          style={{ color: themeParams.button_color }}
        />
      </div>
    );
  }

  if (!models?.length) {
    return (
      <div 
        className="text-center py-12 rounded shadow-md"
        style={{ 
          backgroundColor: themeParams.secondary_bg_color,
          color: themeParams.hint_color 
        }}
      >
        <p>No models found. Train a model to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="shadow-md" style={mainStyle}>
        {/* Header */}
        <div 
          className="grid grid-cols-[2fr,minmax(100px,1fr),80px] gap-4 px-4 py-3 font-medium text-sm border-b"
          style={headerStyle}
        >
          <div>Model</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* List */}
        <div className="divide-y" style={{ borderColor: `${themeParams.button_color}20` }}>
          {models.map((model) => (
            <div key={model.databaseId} className="text-sm">
              <div className="grid grid-cols-[2fr,minmax(100px,1fr),80px] gap-4 px-4 py-3 items-center">
                <div>
                  <div className="font-medium font-mono">{model.name}</div>
                  <div style={{ color: themeParams.hint_color }} className="text-[11px] mt-0.5">
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
                    className="p-1 hover:opacity-80"
                    style={{ color: themeParams.button_color }}
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
                <div 
                  className="px-4 pt-0 pb-3 -mt-2"
                  style={{ backgroundColor: `${themeParams.secondary_bg_color}50` }}
                >
                  <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex space-x-4 border-b" style={{ borderColor: `${themeParams.button_color}20` }}>
                      <button
                        className="px-4 py-2 text-sm font-medium -mb-px"
                        onClick={() => setActiveTab('input')}
                        style={tabStyle(activeTab === 'input')}
                      >
                        Input
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium -mb-px"
                        onClick={() => setActiveTab('output')}
                        style={tabStyle(activeTab === 'output')}
                      >
                        Output
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div>
                      {activeTab === 'input' ? (
                        <div className="p-4 border text-xs" style={cardStyle}>
                          <div className="font-medium mb-2">Training Parameters</div>
                          {model.training ? (
                            <pre 
                              className="p-2 overflow-x-auto"
                              style={{ 
                                backgroundColor: themeParams.bg_color,
                                color: themeParams.hint_color 
                              }}
                            >
                              {JSON.stringify(getTrainingInputParams(model), null, 2)}
                            </pre>
                          ) : (
                            <p style={{ color: themeParams.hint_color }}>
                              No training parameters available
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 border text-xs space-y-4" style={cardStyle}>
                          {model.training?.metadata && (
                            <div>
                              <div className="font-medium mb-1">Training Result</div>
                              <pre 
                                className="p-2 overflow-x-auto"
                                style={{ 
                                  backgroundColor: themeParams.bg_color,
                                  color: themeParams.hint_color 
                                }}
                              >
                                {JSON.stringify(getTrainingOutputParams(model), null, 2)}
                              </pre>
                            </div>
                          )}
                          {!model.training?.metadata && (
                            <p style={{ color: themeParams.hint_color }}>
                              No output data available
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setModelToDelete(model)}
                        className="flex items-center px-3 py-1.5 text-xs font-medium hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          color: '#ff3b30',
                          borderColor: '#ff3b3020'
                        }}
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
        <div 
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          style={{ backgroundColor: `${themeParams.bg_color}80` }}
        >
          <div 
            className="p-6 max-w-md w-full mx-4 border shadow-lg"
            style={cardStyle}
          >
            <h3 className="text-lg font-medium mb-2">Delete Model</h3>
            <p 
              className="text-sm mb-6"
              style={{ color: themeParams.hint_color }}
            >
              Are you sure you want to delete "{modelToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium border hover:opacity-80"
                onClick={() => setModelToDelete(null)}
                style={{
                  color: themeParams.text_color,
                  borderColor: `${themeParams.button_color}20`,
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                onClick={() => handleDelete(modelToDelete)}
                disabled={isDeleting}
                style={{
                  backgroundColor: '#ff3b30',
                  color: '#ffffff'
                }}
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
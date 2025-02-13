import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, ChevronUp, Loader2, Trash2 } from 'lucide-react';
import { Model, LoraStatus } from '@/types/model';
import { useModels } from '@/hooks/useModels';
import { Switch } from '@/components/ui/switch';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    toggleSelection,
    isTogglingSelection,
    deleteModel,
    isDeleting,
  } = useModels();
  const themeParams = useTelegramTheme();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [activeTab, setActiveTab] = useState<DetailsTab>('input');

  const selectedCount = models?.filter(model => model.isSelected)?.length ?? 0;

  const formatDate = (date: Date | string) => {
    return `hace ${formatDistanceToNow(new Date(date), { locale: es })}`;
  };

  const handleDelete = async (model: Model) => {
    if (!model?.databaseId) {
      console.error('No model ID provided for deletion');
      window.Telegram?.WebApp?.showPopup({
        message: 'Datos del modelo inválidos. Por favor, intenta de nuevo.'
      });
      return;
    }
    try {
      await deleteModel(model.databaseId);
      setModelToDelete(null);
      window.Telegram?.WebApp?.showPopup({
        message: `Modelo ${model.name} eliminado exitosamente`
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      window.Telegram?.WebApp?.showPopup({
        message: error instanceof Error 
          ? `Error al eliminar el modelo: ${error.message}`
          : 'Error al eliminar el modelo. Por favor, intenta de nuevo.'
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
        <p>No se encontraron modelos. Entrena un modelo para verlo aquí.</p>
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
          <div>Modelo</div>
          <div className="text-center">Estado</div>
          <div className="text-right">Acciones</div>
        </div>

        {/* List */}
        <div className="divide-y" style={{ borderColor: `${themeParams.button_color}20` }}>
          {models.map((model) => (
            <div key={model.databaseId} className="text-sm">
              <div className="grid grid-cols-[2fr,minmax(100px,1fr),80px] gap-4 px-4 py-3 items-center">
                <div>
                  <div className="font-medium font-mono">{model.name}</div>
                  <div style={{ color: themeParams.hint_color }} className="text-[11px] mt-0.5">
                    {formatDate(model.createdAt)}
                  </div>
                </div>
                <div className="flex justify-center">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[model.status].bg} ${STATUS_COLORS[model.status].text}`}>
                    {model.status}
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Switch 
                          checked={model.isSelected}
                          onCheckedChange={(checked) => {
                            if (checked && selectedCount >= 5) {
                              window.Telegram?.WebApp?.showPopup({
                                message: 'Solo puedes seleccionar hasta 5 modelos'
                              });
                              return;
                            }
                            toggleSelection({ modelId: model.databaseId, isSelected: checked });
                          }}
                          disabled={isTogglingSelection || model.status !== 'COMPLETED' || (!model.isSelected && selectedCount >= 5)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {model.isSelected ? 'Deseleccionar modelo' : 'Seleccionar modelo'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                        Entrada
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium -mb-px"
                        onClick={() => setActiveTab('output')}
                        style={tabStyle(activeTab === 'output')}
                      >
                        Salida
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div>
                      {activeTab === 'input' ? (
                        <div className="p-4 border text-xs" style={cardStyle}>
                          <div className="font-medium mb-2">Parámetros de Entrenamiento</div>
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
                              No hay parámetros de entrenamiento disponibles
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 border text-xs space-y-4" style={cardStyle}>
                          {model.training?.metadata && (
                            <div>
                              <div className="font-medium mb-1">Resultado del Entrenamiento</div>
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
                              No hay datos de salida disponibles
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
                        {isDeleting ? 'Eliminando...' : 'Eliminar Modelo'}
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
            <h3 className="text-lg font-medium mb-2">Eliminar Modelo</h3>
            <p 
              className="text-sm mb-6"
              style={{ color: themeParams.hint_color }}
            >
              ¿Estás seguro de que deseas eliminar "{modelToDelete.name}"? Esta acción no se puede deshacer.
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
                Cancelar
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
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
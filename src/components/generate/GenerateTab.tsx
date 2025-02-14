import { useEffect, useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { useGenerate } from '@/hooks/useGenerate';
import { useParameters } from '@/hooks/useParameters';
import { ModelSelector } from './ModelSelector';
import { LoraSelector } from './LoraSelector';
import { Loader2 } from 'lucide-react';
import type { GenerationParameters } from '@/types';
import type { LoraModel, LoraParameter } from '@/types/lora';
import { saveUserParameters } from '@/api/parameters';
import { getUserModels } from '@/api/loras';
import { useQuery } from '@tanstack/react-query';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import { ImageParameters } from './ImageParameters';

const DEFAULT_PARAMS: GenerationParameters = {
  image_size: 'landscape_4_3',
  num_inference_steps: 28,
  seed: 0, // Default to 0 (random/aleatorio)
  guidance_scale: 3.5,
  enable_safety_checker: true,
  output_format: 'jpeg',
  modelPath: 'fal-ai/flux-lora',
  loras: []
};

export function GenerateTab() {
  const { isPending } = useGenerate();
  const { parameters, isLoading: isLoadingParams, invalidateParameters } = useParameters();
  const [params, setParams] = useState<GenerationParameters>(() => ({
    ...DEFAULT_PARAMS,
    ...parameters
  }));
  const [isSaving, setIsSaving] = useState(false);
  const themeParams = useTelegramTheme();

  // Query for user's models with isSelected flag
  const { data: userModels = [], isLoading: isLoadingModels } = useQuery<LoraModel[]>({
    queryKey: ['models', 'user'],
    queryFn: getUserModels,
    staleTime: 1000, // Update every second
  });

  // Filter selected and completed models
  const selectedModels = useMemo(() => 
    userModels.filter(model => model.isSelected && model.status === 'COMPLETED'),
    [userModels]
  );

  // Map of selected model IDs for quick lookup
  const selectedModelIds = useMemo(() => 
    new Set(selectedModels.map(model => model.databaseId)),
    [selectedModels]
  );

  // Update local state when parameters load
  useEffect(() => {
    if (parameters) {
      setParams(currentParams => {
        const updatedParams = {
          ...DEFAULT_PARAMS,
          ...parameters,
          loras: parameters.loras?.filter(lora => selectedModelIds.has(lora.path)) || [],
          ...Object.fromEntries(
            Object.entries(currentParams).filter(([key]) => 
              !(key in parameters) && key in currentParams
            )
          )
        };
        return updatedParams;
      });
    }
  }, [parameters, selectedModelIds]);

  const updateParam = <K extends keyof GenerationParameters>(
    key: K,
    value: GenerationParameters[K]
  ): void => {
    setParams((prevParams) => ({
      ...prevParams,
      [key]: value
    }));
  };

  const handleAddLora = (lora: LoraParameter) => {
    setParams((prevParams) => ({
      ...prevParams,
      loras: [...(prevParams.loras || []), lora]
    }));
  };

  const handleRemoveLora = (index: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      loras: prevParams.loras?.filter((_, i) => i !== index) || []
    }));
  };

  const handleLoraScaleChange = (index: number, scale: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      loras: prevParams.loras?.map((lora, i) =>
        i === index ? { ...lora, scale } : lora
      ) || []
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveUserParameters(params);
      await invalidateParameters();
      
      window.Telegram?.WebApp?.sendData(JSON.stringify({
        action: 'save_params',
        params
      }));
      window.Telegram?.WebApp?.close();
    } catch (error) {
      console.error('Error saving parameters:', error);
      window.Telegram?.WebApp?.showPopup({
        message: 'Error al guardar los parámetros. Por favor intenta de nuevo.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cardStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const buttonStyle = {
    backgroundColor: themeParams.button_color,
    color: themeParams.button_text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  if (isLoadingParams || isLoadingModels) {
    return (
      <Card className="shadow-md" style={cardStyle}>
        <div className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: themeParams.button_color }} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-md" style={cardStyle}>
      <div className="p-6 space-y-8">
        <ModelSelector 
          onSelect={(modelPath: string) => updateParam('modelPath', modelPath)}
          defaultValue={params.modelPath}
        />

        {/* LoRA Selection */}
        <div className="space-y-4">
          {selectedModels.length > 0 ? (
            <LoraSelector
              loras={params.loras || []}
              availableLoras={selectedModels.map(lora => ({
                path: lora.databaseId,
                name: lora.name,
                triggerWord: lora.triggerWord
              }))}
              onAdd={handleAddLora}
              onRemove={handleRemoveLora}
              onScaleChange={handleLoraScaleChange}
            />
          ) : (
            <p className="text-sm" style={hintStyle}>
              No hay modelos LoRA seleccionados disponibles. Ve a la pestaña Modelos para seleccionar los modelos que quieres usar.
            </p>
          )}
        </div>

        {/* Image Parameters */}
        <ImageParameters
          params={params}
          updateParam={updateParam}
          themeParams={themeParams}
        />

        {/* Save Button */}
        <button
          className="w-full py-3 px-4 text-sm font-semibold shadow-sm hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending || isSaving}
          onClick={handleSave}
          style={buttonStyle}
        >
          {isSaving ? 'Guardando...' : 'Guardar Parámetros'}
        </button>
      </div>
    </Card>
  );
}
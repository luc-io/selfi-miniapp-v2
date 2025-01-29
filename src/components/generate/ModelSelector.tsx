import React, { useState } from 'react';
import { Box, X } from 'lucide-react';
import { Button } from '../ui/Layout';
import { cn } from '@/lib/utils';
import { usePublicModels } from '@/hooks/useModels';
import type { LoraModel } from '@/api';

interface ModelSelectorProps {
  selected?: LoraModel;
  onSelect: (model: LoraModel | undefined) => void;
  disabled?: boolean;
}

export function ModelSelector({ selected, onSelect, disabled }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: models = [], isLoading } = usePublicModels();

  const handleSelect = (model: LoraModel) => {
    onSelect(model);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelect(undefined);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Style (optional)
      </label>

      {!selected ? (
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-gray-600"
          onClick={() => setIsOpen(true)}
          disabled={disabled || isLoading}
        >
          <Box className="w-4 h-4 mr-2" />
          {isLoading ? 'Loading styles...' : 'Select a style to use'}
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-white border border-gray-200 rounded-md p-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selected.name}</h4>
                <p className="text-sm text-gray-500">
                  Trigger: {selected.triggerWord}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(true)}
            disabled={disabled}
          >
            Change
          </Button>
        </div>
      )}

      {/* Model selection dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Select Style</h3>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {models.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No styles available
                </div>
              ) : (
                <div className="grid gap-4">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleSelect(model)}
                      className={cn(
                        'w-full text-left p-3 rounded-md border transition-colors',
                        'hover:border-blue-500 hover:bg-blue-50',
                        selected?.id === model.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        {model.previewImageUrl && (
                          <img
                            src={model.previewImageUrl}
                            alt={model.name}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{model.name}</h4>
                          <p className="text-sm text-gray-500">
                            Trigger: {model.triggerWord}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
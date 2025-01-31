import { useState } from 'react';
import { Button } from '../ui/components';
import { useModels } from '@/hooks/useModels';
import type { Model } from '@/types';
import type { ModelSelectorProps } from './types';

export function ModelSelector({ onSelect }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { models } = useModels();
  const [selected, setSelected] = useState<Model>();

  const handleSelect = (model: Model) => {
    setSelected(model);
    onSelect(model);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelected(undefined);
    onSelect(undefined);
  };

  if (!isOpen && !selected) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Select Model
      </Button>
    );
  }

  if (!isOpen && selected) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => setIsOpen(true)}
          className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {selected.name}
        </Button>
        <Button
          onClick={handleClear}
          className="bg-red-100 text-red-700 hover:bg-red-200"
        >
          Clear
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h3 className="font-medium">Select Model</h3>
        <Button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {models.map((model: Model) => (
          <Button
            key={model.id}
            onClick={() => handleSelect(model)}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {model.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
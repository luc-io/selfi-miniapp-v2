import React from 'react';
import { Switch } from '@/components/ui/switch';
import { TrainingTogglesProps } from './types';

export const TrainingToggles: React.FC<TrainingTogglesProps> = ({ 
  isStyle, 
  createMasks, 
  onStyleChange,
  onMasksChange,
  disabled = false 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium">Style Mode</label>
          <p className="text-xs text-gray-500">
            Train a general style instead of a specific subject
          </p>
        </div>
        <Switch
          checked={isStyle}
          onCheckedChange={onStyleChange}
          disabled={disabled}
          className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
        />
      </div>

      {!isStyle && (
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium">Create Masks</label>
            <p className="text-xs text-gray-500">
              Generate masks to improve subject isolation
            </p>
          </div>
          <Switch
            checked={createMasks}
            onCheckedChange={onMasksChange}
            disabled={disabled}
            className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
          />
        </div>
      )}
    </div>
  );
};
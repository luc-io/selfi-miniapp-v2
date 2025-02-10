import React from 'react';
import { TrainingStepsProps } from './types';

const STEP_OPTIONS = [100, 150, 200, 300];

export const TrainingSteps: React.FC<TrainingStepsProps> = ({ 
  value, 
  onChange,
  disabled = false 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Training Steps
      </label>
      <div className="grid grid-cols-4 gap-2">
        {STEP_OPTIONS.map((steps) => (
          <button
            key={steps}
            type="button"
            onClick={() => !disabled && onChange(steps)}
            className={`p-2 border rounded-md text-center transition-colors ${
              value === steps ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}`}
            disabled={disabled}
          >
            {steps}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        More steps = better quality, but takes longer to train
      </p>
    </div>
  );
};
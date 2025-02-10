import React from 'react';
import { TriggerWordInputProps } from './types';

export const TriggerWordInput: React.FC<TriggerWordInputProps> = ({ 
  value, 
  isStyle, 
  onChange,
  disabled = false 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {isStyle ? 'Style Name' : 'Trigger Word'}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isStyle ? 
          "Enter a unique name for your style..." : 
          "Enter a trigger word for your model..."
        }
        className={`w-full p-2 border rounded-md ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
      />
      <p className="text-xs text-gray-500">
        {isStyle ? 
          "This name will be used to invoke your style in prompts" : 
          "This word will be used to trigger your model in prompts"
        }
      </p>
    </div>
  );
};
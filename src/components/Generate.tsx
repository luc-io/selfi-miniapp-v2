import React, { useState } from 'react';
import { generateImage } from '@/lib/api';
import { type GenerationParameters, type GenerationResponse } from '@/types/generation';

interface GenerateProps {
  activeParams: GenerationParameters;
  onGenerated?: (result: GenerationResponse) => void;
  disabled?: boolean;
}

const Generate: React.FC<GenerateProps> = ({ 
  activeParams, 
  onGenerated,
  disabled = false 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (disabled || isGenerating) return;

    try {
      setIsGenerating(true);
      const result = await generateImage(activeParams);
      onGenerated?.(result);
    } catch (error) {
      console.error('Generation failed:', error);
      // Handle error appropriately
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      className={`w-full py-3 px-4 text-sm font-semibold bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
        (disabled || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || isGenerating}
    >
      {isGenerating ? 'Generating...' : 'Generate'}
    </button>
  );
};

export default Generate;
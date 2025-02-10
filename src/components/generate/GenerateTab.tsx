import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { saveUserParameters } from '@/api/parameters';
import { LoraOption } from '@/types/params';
import { GenerationParameters } from '@/types/generation';
import { DEFAULT_PARAMS } from '@/constants/generation';
import { useUserParameters } from '@/hooks/useParameters';

interface GenerateTabProps {
  // Add props as needed
}

const GenerateTab: React.FC<GenerateTabProps> = () => {
  const [params, setParams] = useState<GenerationParameters>(DEFAULT_PARAMS);
  const [selectedModelIds, setSelectedModelIds] = useState<Set<string>>(new Set());
  const { parameters, isLoading } = useUserParameters();

  useEffect(() => {
    if (parameters) {
      // Convert parameters to GenerationParameters format
      const convertedParams: GenerationParameters = {
        ...DEFAULT_PARAMS,
        ...parameters,
        loras: Array.isArray(parameters.loras) 
          ? parameters.loras.filter((lora: LoraOption) => 
              selectedModelIds.has(lora.path)
            ) 
          : []
      };
      setParams(convertedParams);
    }
  }, [parameters, selectedModelIds]);

  const handleSaveParameters = async () => {
    try {
      await saveUserParameters({ params });
    } catch (error) {
      console.error('Failed to save parameters:', error);
    }
  };

  return (
    <Card>
      {/* Add your tab content here */}
    </Card>
  );
};

export default GenerateTab;
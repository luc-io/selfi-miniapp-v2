import { useState, useEffect } from 'react';
import { getUserParameters } from '@/api/parameters';
import { type ParamsOption } from '@/types/params';

interface UseParametersResult {
  parameters: Record<string, ParamsOption> | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useParameters = (): UseParametersResult => {
  const [parameters, setParameters] = useState<Record<string, ParamsOption> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchParameters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserParameters();
      setParameters(response.params);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch parameters'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  return {
    parameters,
    isLoading,
    error,
    refetch: fetchParameters
  };
};
import { useQuery } from '@tanstack/react-query';

interface BaseModel {
  modelPath: string;
}

const DEFAULT_MODEL: BaseModel = {
  modelPath: 'fal-ai/flux-lora'
};

async function fetchModels() {
  return [DEFAULT_MODEL];
}

export function useModels() {
  const { data: models = [DEFAULT_MODEL] } = useQuery<BaseModel[]>({
    queryKey: ['models'],
    queryFn: fetchModels,
    initialData: [DEFAULT_MODEL],
  });

  return {
    models,
    getModel: () => DEFAULT_MODEL
  };
}
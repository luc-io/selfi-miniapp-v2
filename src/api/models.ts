import { Model } from '@/types/model';

// Mock data for development
const mockModels: Model[] = [
  {
    id: 1,
    name: "Beach Landscape",
    triggerWord: "<beach>",
    createdAt: new Date('2024-02-04'),
    isActive: true,
    config_file: {
      url: "https://v3.fal.media/files/panda/X1qP-fJhUlclTMJDLG0VR_config.json",
      file_name: "config.json",
      file_size: 1347,
      content_type: "application/octet-stream"
    },
    diffusers_lora_file: {
      url: "https://v3.fal.media/files/lion/wh1mXu5G7cNTAz01NnbG9_pytorch_lora_weights.safetensors",
      file_name: "pytorch_lora_weights.safetensors",
      file_size: 89745224,
      content_type: "application/octet-stream"
    }
  },
  {
    id: 2,
    name: "Portrait Style",
    triggerWord: "<portrait>",
    createdAt: new Date('2024-02-03'),
    isActive: false,
    config_file: {
      url: "https://v3.fal.media/files/panda/Y2qP-gKhVmclTMJDLG0VR_config.json",
      file_name: "config.json",
      file_size: 1422,
      content_type: "application/octet-stream"
    },
    diffusers_lora_file: {
      url: "https://v3.fal.media/files/lion/xj2mXu5G7cNTAz01NnbG9_pytorch_lora_weights.safetensors",
      file_name: "pytorch_lora_weights.safetensors",
      file_size: 92458331,
      content_type: "application/octet-stream"
    }
  }
];

export async function getModels(): Promise<Model[]> {
  // For development, return mock data
  return Promise.resolve(mockModels);
}

export async function toggleModelActivation(modelId: number, isActive: boolean): Promise<void> {
  // For development, just log
  console.log('Toggling model', modelId, 'to', isActive);
  
  // Mock successful response
  return Promise.resolve();
}

export async function deleteModel(modelId: number): Promise<void> {
  // For development, just log
  console.log('Deleting model', modelId);
  
  // Mock successful response
  return Promise.resolve();
}

export async function downloadModelConfig(_modelId: number): Promise<Blob> {
  // For development, return mock config blob
  return Promise.resolve(new Blob(['{"test": "config"}'], { type: 'application/json' }));
}
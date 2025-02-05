import axios from 'axios';
import { Model } from '@/types/model';

const API_URL = import.meta.env.VITE_API_URL;

// Mock data for development
const mockModels: Model[] = [
  {
    id: 1,
    name: "Beach Landscape LoRA",
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
    name: "Portrait Style LoRA",
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
  
  // When backend is ready:
  // const response = await axios.get(`${API_URL}/api/models`);
  // return response.data;
}

export async function toggleModelActivation(modelId: number, isActive: boolean): Promise<void> {
  // For development, just log
  console.log('Toggling model', modelId, 'to', isActive);
  
  // When backend is ready:
  // await axios.patch(`${API_URL}/api/models/${modelId}/active`, { isActive });
}

export async function deleteModel(modelId: number): Promise<void> {
  // For development, just log
  console.log('Deleting model', modelId);
  
  // When backend is ready:
  // await axios.delete(`${API_URL}/api/models/${modelId}`);
}

export async function downloadModelConfig(modelId: number): Promise<Blob> {
  // For development, return empty blob
  return new Blob(['{"test": "config"}'], { type: 'application/json' });
  
  // When backend is ready:
  // const response = await axios.get(`${API_URL}/api/models/${modelId}/config`, {
  //   responseType: 'blob'
  // });
  // return response.data;
}
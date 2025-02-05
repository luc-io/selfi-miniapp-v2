// Mock data
export const MOCK_MODELS = [
  {
    id: '1',
    name: 'My First Model',
    triggerWord: "style_01",
    isPublic: true,
    status: 'COMPLETED',
    createdAt: '2024-02-04T00:00:00Z',
    isActive: true,
    input: {
      steps: 100,
      is_style: true,
      create_masks: false,
      trigger_word: 'style_01'
    },
    config_file: {
      url: 'https://example.com/config.json',
      file_name: 'config.json',
      file_size: 1024,
      content_type: 'application/json'
    },
    diffusers_lora_file: {
      url: 'https://example.com/model.safetensors',
      file_name: 'model.safetensors',
      file_size: 150000000,
      content_type: 'application/octet-stream'
    }
  },
  {
    id: '2',
    name: 'Portrait Style',
    triggerWord: "portrait_01",
    isPublic: false,
    status: 'TRAINING',
    createdAt: '2024-02-03T00:00:00Z',
    isActive: false,
    input: {
      steps: 200,
      is_style: true,
      create_masks: true,
      trigger_word: 'portrait_01'
    }
  }
];
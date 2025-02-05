import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Info, Trash2, ChevronRight, Download } from 'lucide-react';
import { Model } from '../types/model';

// Sample data - replace with actual data from your API
const sampleModel: Model = {
  id: 1,
  name: "Model #1",
  createdAt: new Date('2024-02-04'),
  isActive: true,
  status: "ready",
  input: {}, // Add appropriate input data structure
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
};
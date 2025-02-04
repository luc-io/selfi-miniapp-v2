import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Info, Trash2, ChevronRight, Download } from 'lucide-react';

// Sample data - replace with actual data from your API
const sampleModel = {
  id: 1,
  name: "Model #1",
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
};

const ModelsTab = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Models</h2>
        <button className="flex items-center px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50">
          <Info className="w-4 h-4 mr-2" />
          Help
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{sampleModel.name}</h3>
                <p className="text-sm text-gray-500">
                  Created {formatDistanceToNow(sampleModel.createdAt)} ago
                </p>
              </div>
              <div className="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 bg-gray-200">
                <span
                  className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out translate-x-${sampleModel.isActive ? '5' : '0'}`}
                />
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Model Size: {formatFileSize(sampleModel.diffusers_lora_file.file_size)}</span>
                <button 
                  onClick={() => setSelectedModel(sampleModel)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Config
                </button>
                <button className="flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedModel && (
        <div className="mt-6 bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Model Details</h3>
            <p className="text-sm text-gray-500">
              Technical information and configuration
            </p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Configuration File</h4>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(selectedModel.config_file, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-2">Model File</h4>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(selectedModel.diffusers_lora_file, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelsTab;
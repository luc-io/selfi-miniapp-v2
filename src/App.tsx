import { useState } from 'react';
import { GenerateTab } from './components/generate/GenerateTab';
import TrainTab from './components/train/TrainTab';
import { ModelsTab } from './components/models/ModelsTab';

const TABS = {
  GENERATE: 'generate',
  TRAIN: 'train',
  MODELS: 'models',
} as const;

type TabType = typeof TABS[keyof typeof TABS];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>(TABS.GENERATE);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          <button
            className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === TABS.GENERATE
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(TABS.GENERATE)}
          >
            Generate
          </button>
          <button
            className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === TABS.TRAIN
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(TABS.TRAIN)}
          >
            Train
          </button>
          <button
            className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === TABS.MODELS
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(TABS.MODELS)}
          >
            Models
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === TABS.GENERATE && <GenerateTab />}
          {activeTab === TABS.TRAIN && <TrainTab />}
          {activeTab === TABS.MODELS && <ModelsTab />}
        </div>
      </div>
    </div>
  );
}

export default App;
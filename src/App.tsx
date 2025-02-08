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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-card p-1 rounded-lg shadow-md mb-6">
          <button
            className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === TABS.GENERATE
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={() => setActiveTab(TABS.GENERATE)}
          >
            Generate
          </button>
          <button
            className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === TABS.TRAIN
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={() => setActiveTab(TABS.TRAIN)}
          >
            Train
          </button>
          <button
            className={`flex-1 py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === TABS.MODELS
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
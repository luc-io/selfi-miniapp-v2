import { useState } from 'react';
import { GenerateTab } from './components/generate/GenerateTab';
import { TrainTab } from './components/train/index';
import { ModelsTab } from './components/models/ModelsTab';
import { ImagesTab } from './components/images';
import { useTelegramTheme } from './hooks/useTelegramTheme';
import { Toaster } from '@/components/ui/toaster';

const TABS = {
  GENERATE: 'generate',
  TRAIN: 'train',
  MODELS: 'models',
  IMAGES: 'images',
} as const;

type TabType = typeof TABS[keyof typeof TABS];

function App() {
  const [activeTab, setActiveTab] = useState<TabType>(TABS.GENERATE);
  const themeParams = useTelegramTheme();

  const containerStyle = {
    backgroundColor: themeParams.bg_color,
    minHeight: '100vh',
  };

  const tabsContainerStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    borderColor: `${themeParams.button_color}20`,
  };

  const tabStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? themeParams.button_color : 'transparent',
    color: isActive ? themeParams.button_text_color : themeParams.hint_color,
  });

  return (
    <div style={containerStyle}>
      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div 
          className="flex space-x-1 p-1 shadow-md mb-6 border rounded-lg"
          style={tabsContainerStyle}
        >
          <button
            className="flex-1 py-2.5 px-3 text-sm font-medium transition-colors rounded-md hover:opacity-80"
            onClick={() => setActiveTab(TABS.GENERATE)}
            style={tabStyle(activeTab === TABS.GENERATE)}
          >
            Generar
          </button>
          <button
            className="flex-1 py-2.5 px-3 text-sm font-medium transition-colors rounded-md hover:opacity-80"
            onClick={() => setActiveTab(TABS.TRAIN)}
            style={tabStyle(activeTab === TABS.TRAIN)}
          >
            Entrenar
          </button>
          <button
            className="flex-1 py-2.5 px-3 text-sm font-medium transition-colors rounded-md hover:opacity-80"
            onClick={() => setActiveTab(TABS.MODELS)}
            style={tabStyle(activeTab === TABS.MODELS)}
          >
            Modelos
          </button>
          <button
            className="flex-1 py-2.5 px-3 text-sm font-medium transition-colors rounded-md hover:opacity-80"
            onClick={() => setActiveTab(TABS.IMAGES)}
            style={tabStyle(activeTab === TABS.IMAGES)}
          >
            Imágenes
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === TABS.GENERATE && <GenerateTab />}
          {activeTab === TABS.TRAIN && <TrainTab />}
          {activeTab === TABS.MODELS && <ModelsTab />}
          {activeTab === TABS.IMAGES && <ImagesTab />}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
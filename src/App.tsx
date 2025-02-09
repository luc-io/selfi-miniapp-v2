import { useState } from 'react';
import { GenerateTab } from './components/generate/GenerateTab';
import TrainTab from './components/train/TrainTab';
import { ModelsTab } from './components/models/ModelsTab';
import { useTelegramTheme } from './hooks/useTelegramTheme';

const TABS = {
  GENERATE: 'generate',
  TRAIN: 'train',
  MODELS: 'models',
} as const;

type TabType = typeof TABS[keyof typeof TABS];

// Default theme values
const DEFAULT_THEME = {
  bg_color: '#ffffff',
  text_color: '#000000',
  hint_color: '#999999',
  button_color: '#3390ec',
  button_text_color: '#ffffff',
  secondary_bg_color: '#f4f4f5',
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>(TABS.GENERATE);
  const themeParams = useTelegramTheme();

  // Apply theme with fallbacks
  const theme = {
    bg_color: themeParams.bg_color || DEFAULT_THEME.bg_color,
    text_color: themeParams.text_color || DEFAULT_THEME.text_color,
    hint_color: themeParams.hint_color || DEFAULT_THEME.hint_color,
    button_color: themeParams.button_color || DEFAULT_THEME.button_color,
    button_text_color: themeParams.button_text_color || DEFAULT_THEME.button_text_color,
    secondary_bg_color: themeParams.secondary_bg_color || DEFAULT_THEME.secondary_bg_color,
  };

  const containerStyle = {
    backgroundColor: theme.bg_color,
    minHeight: '100vh',
  };

  const tabsContainerStyle = {
    backgroundColor: theme.secondary_bg_color,
    borderColor: `${theme.button_color}20`,
  };

  const tabStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? theme.button_color : 'transparent',
    color: isActive ? theme.button_text_color : theme.hint_color,
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
            Generate
          </button>
          <button
            className="flex-1 py-2.5 px-3 text-sm font-medium transition-colors rounded-md hover:opacity-80"
            onClick={() => setActiveTab(TABS.TRAIN)}
            style={tabStyle(activeTab === TABS.TRAIN)}
          >
            Train
          </button>
          <button
            className="flex-1 py-2.5 px-3 text-sm font-medium transition-colors rounded-md hover:opacity-80"
            onClick={() => setActiveTab(TABS.MODELS)}
            style={tabStyle(activeTab === TABS.MODELS)}
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
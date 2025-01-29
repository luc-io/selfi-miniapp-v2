import React, { useState } from 'react';
import { Wand2, Sparkles, Images } from 'lucide-react';
import { Layout, Tabs } from './components/ui/Layout';
import { useTelegram } from './hooks/useTelegram';
import { GenerateTab } from './components/generate/GenerateTab';
import { TrainTab } from './components/train/TrainTab';
import { ModelsTab } from './components/models/ModelsTab';

// Tab configuration
const TABS = [
  {
    id: 'generate',
    label: 'Generate',
    icon: <Wand2 className="w-4 h-4" />,
  },
  {
    id: 'train',
    label: 'Train',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'models',
    label: 'My Models',
    icon: <Images className="w-4 h-4" />,
  },
] as const;

type TabId = typeof TABS[number]['id'];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('generate');
  const { user, isReady } = useTelegram();

  if (!isReady || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabId)}
      />

      <div className="mt-6">
        {activeTab === 'generate' && <GenerateTab />}
        {activeTab === 'train' && <TrainTab />}
        {activeTab === 'models' && <ModelsTab />}
      </div>
    </Layout>
  );
}
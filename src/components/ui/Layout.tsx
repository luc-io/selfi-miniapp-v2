import { type ReactNode } from 'react';

export interface TabProps {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface TabsProps {
  tabs: readonly TabProps[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center px-4 py-2 rounded-lg ${
            activeTab === tab.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      {children}
    </div>
  );
}
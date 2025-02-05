import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Info, Trash2, ChevronRight, Download } from 'lucide-react';
import { Model } from '../types/model';

export function ModelsTab() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Your Models</h2>
        <button className="flex items-center px-4 py-2 text-sm font-medium border rounded-lg bg-background hover:bg-muted">
          <Info className="w-4 h-4 mr-2" />
          Help
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Models will be rendered here */}
      </div>
    </div>
  );
}
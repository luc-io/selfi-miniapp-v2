import { useCallback, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Model, LoraStatus } from '@/types/model';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Trash2, 
  Download, 
  Play, 
  Pause,
  ChevronRight,
  Info
} from 'lucide-react';

const statusStyles: Record<LoraStatus, { bg: string; text: string }> = {
  'COMPLETED': { bg: 'bg-green-100', text: 'text-green-700' },
  'TRAINING': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'FAILED': { bg: 'bg-red-100', text: 'text-red-700' },
  'PENDING': { bg: 'bg-gray-100', text: 'text-gray-700' },
};

function ModelCard({ model }: { model: Model }) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handleToggleActive = useCallback(async () => {
    setIsToggling(true);
    try {
      // Toggle logic here
    } catch (error) {
      console.error('Failed to toggle model:', error);
    } finally {
      setIsToggling(false);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      // Delete logic here
    } catch (error) {
      console.error('Failed to delete model:', error);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return (
    <Card className="bg-card border-border">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-foreground">{model.name}</h3>
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(model.createdAt)} ago
            </p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${statusStyles[model.status].bg} ${statusStyles[model.status].text}`}>
              {model.status}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleActive}
            disabled={isToggling || model.status === 'TRAINING'}
            className="h-9 w-9"
          >
            {model.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Model Size: {formatFileSize(model.diffusers_lora_file.file_size)}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDetails(!showDetails)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(model.config_file.url, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Config
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={isDeleting || model.status === 'TRAINING'}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
      
      {showDetails && (
        <div className="p-4 border-t border-border">
          <h4 className="font-medium mb-2 text-foreground">Model Details</h4>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm text-muted-foreground">
            {JSON.stringify(model, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
}

export function ModelsTab() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Your Models</h2>
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4 mr-2" />
          Help
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Models will be mapped here */}
      </div>
    </div>
  );
}
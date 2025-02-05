import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { LoraConfig } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface LoraSelectorProps {
  loras: LoraConfig[];
  onChange: (loras: LoraConfig[]) => void;
}

export function LoraSelector({ loras, onChange }: LoraSelectorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLora, setNewLora] = useState<Partial<LoraConfig>>({});

  const handleAdd = () => {
    if (newLora.path && newLora.scale) {
      onChange([...loras, { path: newLora.path, scale: newLora.scale }]);
      setNewLora({});
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(loras.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">LoRA Models</CardTitle>
        <CardDescription className="text-muted-foreground">Add and configure LoRA models</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loras.map((lora, index) => (
          <div key={index} className="flex items-center gap-4 p-2 rounded-md bg-muted">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{lora.path}</p>
              <div className="flex items-center gap-2">
                <Slider
                  value={[lora.scale]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => {
                    const newLoras = [...loras];
                    newLoras[index].scale = value[0];
                    onChange(newLoras);
                  }}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {lora.scale.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="p-1 hover:bg-background rounded-md text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {isAdding ? (
          <div className="space-y-4 p-4 rounded-md bg-muted">
            <div>
              <Label htmlFor="lora-path" className="text-sm font-medium">Model Path</Label>
              <Input
                id="lora-path"
                value={newLora.path || ''}
                onChange={(e) => setNewLora({ ...newLora, path: e.target.value })}
                placeholder="Enter LoRA model path"
                className="mt-1 bg-background"
              />
            </div>
            <div>
              <Label htmlFor="lora-scale" className="text-sm font-medium">Scale</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="lora-scale"
                  value={[newLora.scale || 0.5]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => setNewLora({ ...newLora, scale: value[0] })}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {(newLora.scale || 0.5).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAdd}
                disabled={!newLora.path}
                className="flex-1"
              >
                Add Model
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewLora({});
                }}
                className="bg-background hover:bg-muted"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full bg-muted hover:bg-muted/80"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add LoRA Model
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
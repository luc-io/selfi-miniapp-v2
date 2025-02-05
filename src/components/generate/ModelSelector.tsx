import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const modelOptions = [
  { label: 'Flux LoRA', value: 'fal-ai/flux-lora' },
  { label: 'SDXL Base', value: 'stabilityai/stable-diffusion-xl-base-1.0' },
];

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Base Model</CardTitle>
        <CardDescription className="text-muted-foreground">Select the base model for generation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="model-select">Model</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id="model-select" className="w-full bg-muted">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-foreground hover:bg-muted"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
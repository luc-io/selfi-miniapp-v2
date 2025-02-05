import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { GenerationParameters } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface AdvancedOptionsProps {
  parameters: GenerationParameters;
  onChange: (params: GenerationParameters) => void;
}

export function AdvancedOptions({ parameters, onChange }: AdvancedOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Advanced Options</CardTitle>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="steps" className="text-sm font-medium">Inference Steps</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="steps"
                min={1}
                max={100}
                step={1}
                value={[parameters.num_inference_steps]}
                onValueChange={(value) => {
                  onChange({
                    ...parameters,
                    num_inference_steps: value[0]
                  });
                }}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {parameters.num_inference_steps}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="guidance" className="text-sm font-medium">Guidance Scale</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="guidance"
                min={1}
                max={20}
                step={0.1}
                value={[parameters.guidance_scale]}
                onValueChange={(value) => {
                  onChange({
                    ...parameters,
                    guidance_scale: value[0]
                  });
                }}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {parameters.guidance_scale.toFixed(1)}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="seed" className="text-sm font-medium">Seed</Label>
            <Input
              id="seed"
              type="number"
              value={parameters.seed}
              onChange={(e) => {
                onChange({
                  ...parameters,
                  seed: parseInt(e.target.value)
                });
              }}
              className="bg-muted"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="safety" className="text-sm font-medium">Safety Checker</Label>
            <Switch
              id="safety"
              checked={parameters.enable_safety_checker}
              onCheckedChange={(checked) => {
                onChange({
                  ...parameters,
                  enable_safety_checker: checked
                });
              }}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
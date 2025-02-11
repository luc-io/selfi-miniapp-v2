import { useState } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { TelegramThemeParams } from '@/types/telegram';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GuidanceInputProps {
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
  themeParams: TelegramThemeParams;
}

export function GuidanceInput({ value, onChange, onReset, themeParams }: GuidanceInputProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label 
            className="block text-sm font-medium" 
            style={{ color: themeParams.text_color }}
          >
            CFG Scale
          </label>
          <span 
            className="text-sm"
            style={{ color: themeParams.hint_color }}
          >
            ({value.toFixed(1)})
          </span>
          <TooltipProvider>
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
              <TooltipTrigger asChild onClick={() => setIsTooltipOpen(!isTooltipOpen)}>
                <button 
                  type="button" 
                  className="hover:opacity-80 transition-opacity focus:outline-none"
                  aria-label="Toggle guidance scale info"
                >
                  <Info 
                    className="h-3.5 w-3.5" 
                    style={{ color: themeParams.hint_color }} 
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="start"
                className="text-sm max-w-[200px]" 
                style={{ 
                  backgroundColor: `${themeParams.bg_color}E6`,
                  color: themeParams.hint_color,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Controls how closely the AI follows your prompt. Higher values = more faithful to prompt but potentially less creative.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <button 
          onClick={onReset}
          className="p-1 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none"
          style={{ color: themeParams.button_color }}
          title="Reset to default (3.5)"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
      <Slider 
        value={[value]}
        onValueChange={(v: number[]) => onChange(v[0])}
        min={1}
        max={20}
        step={0.1}
        className="py-2"
        style={{
          '--slider-thumb-bg': themeParams.button_color,
          '--slider-track-bg': themeParams.button_color,
        } as React.CSSProperties}
      />
    </div>
  );
}
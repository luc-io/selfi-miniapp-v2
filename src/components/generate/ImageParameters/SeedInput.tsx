import { Info, RotateCcw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TelegramThemeParams } from '@/types/telegram';

interface SeedInputProps {
  value: number;
  onChange: (value: number) => void;
  themeParams: TelegramThemeParams;
}

// Generate random seed using a larger range similar to fal-ai
const generateRandomSeed = (): number => {
  // Generate a random number between 0 and Number.MAX_SAFE_INTEGER
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

// Format seed for display (empty for Random or the actual number)
const formatSeedForDisplay = (seed: number): string => {
  if (seed === 0) return "";
  return String(seed);
};

// Parse user input to valid seed
const parseSeedInput = (input: string): number => {
  if (!input) return 0;
  // Remove any non-numeric characters
  const cleanInput = input.replace(/[^0-9]/g, '');
  if (!cleanInput) return 0;
  
  // Parse as a big number, being careful with limits
  const num = Number(cleanInput);
  return isNaN(num) ? 0 : Math.min(num, Number.MAX_SAFE_INTEGER);
};

export function SeedInput({ value, onChange, themeParams }: SeedInputProps) {
  const handleSeedChange = (input: string) => {
    onChange(parseSeedInput(input));
  };

  const handleRandomSeed = () => {
    onChange(generateRandomSeed());
  };

  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  const inputStyle = {
    backgroundColor: themeParams.secondary_bg_color,
    color: themeParams.text_color,
    borderColor: themeParams.button_color,
  };

  const resetButtonStyle = {
    color: themeParams.button_color,
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium" style={labelStyle}>
          Seed
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4" style={hintStyle} />
            </TooltipTrigger>
            <TooltipContent>
              <p>The same seed and the same prompt given to the same version of the model will output the same image every time.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formatSeedForDisplay(value)}
          onChange={(e) => handleSeedChange(e.target.value)}
          placeholder="Random"
          className="w-full px-3 py-1.5 rounded-md border text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1"
          style={inputStyle}
        />
        <button
          onClick={handleRandomSeed}
          className="p-1.5 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none flex-shrink-0"
          style={resetButtonStyle}
          title="Generate random seed"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { RotateCcw, X, Info } from 'lucide-react';
import type { TelegramThemeParams } from '@/types/telegram';

interface SeedInputProps {
  value: number;
  onChange: (value: number) => void;
  themeParams: TelegramThemeParams;
}

const formatSeedForDisplay = (seed: number): string => {
  if (seed === 0) return 'aleatorio';
  return String(seed);
};

const parseSeedInput = (input: string): number => {
  // Handle empty input or "aleatorio"
  if (!input || input.trim() === '' || input.toLowerCase() === 'aleatorio') {
    return 0; // Use 0 for random
  }

  const cleanInput = input.replace(/[^0-9]/g, '');
  if (!cleanInput) return 0; // Use 0 for random if no valid numbers
  
  // Convert to number
  const num = Number(cleanInput);
  
  // If number is 0, use it (for random)
  if (num === 0) return 0;
  
  // Handle numbers with more than 7 digits
  if (cleanInput.length > 7) {
    return Number(cleanInput.slice(0, 7));
  }
  
  return num;
};

export function SeedInput({ value, onChange, themeParams }: SeedInputProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [inputValue, setInputValue] = useState(formatSeedForDisplay(value));

  // For random seed requests
  const handleRandomSeed = () => {
    setInputValue('aleatorio');
    onChange(0);
  };

  // For clear button and "aleatorio" option
  const handleClearSeed = () => {
    setInputValue('aleatorio');
    onChange(0);
  };

  const handleSeedChange = (input: string) => {
    setInputValue(input);
    const parsedValue = parseSeedInput(input);
    onChange(parsedValue);
  };

  // Update input value when prop changes (e.g., on initial load)
  useEffect(() => {
    const displayValue = formatSeedForDisplay(value);
    if (displayValue !== inputValue) {
      setInputValue(displayValue);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label 
            className="block text-sm font-medium" 
            style={{ color: themeParams.text_color }}
          >
            Semilla (Seed)
          </label>
          <button 
            type="button"
            className="hover:opacity-80 transition-opacity focus:outline-none"
            onClick={() => setShowHelp(!showHelp)}
            aria-label="Ver información de seed"
          >
            <Info 
              className="h-3.5 w-3.5" 
              style={{ color: themeParams.hint_color }} 
            />
          </button>
        </div>
        {showHelp && (
          <p 
            className="text-sm" 
            style={{ color: themeParams.hint_color }}
          >
            Mismo seed + prompt = misma imagen. Usa "aleatorio" o 0 para seed aleatorio.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleSeedChange(e.target.value)}
          placeholder="aleatorio"
          className="w-full px-3 py-1.5 rounded-md border text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1"
          style={{
            backgroundColor: themeParams.secondary_bg_color,
            color: themeParams.text_color,
            borderColor: `${themeParams.button_color}80`
          }}
        />
        <button
          onClick={handleClearSeed}
          className="p-1.5 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none flex-shrink-0"
          style={{ 
            backgroundColor: themeParams.button_color,
            color: themeParams.button_text_color
          }}
          title="Usar seed aleatorio"
        >
          <X className="h-4 w-4" />
        </button>
        <button
          onClick={handleRandomSeed}
          className="p-1.5 rounded-md transition-opacity duration-200 hover:opacity-80 focus:outline-none flex-shrink-0"
          style={{ 
            backgroundColor: themeParams.button_color,
            color: themeParams.button_text_color
          }}
          title="Generar seed aleatorio"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
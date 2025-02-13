import { useState } from 'react';
import { RotateCcw, X, Info } from 'lucide-react';
import type { TelegramThemeParams } from '@/types/telegram';
import { generateFalSeed } from '@/utils/seed';

interface SeedInputProps {
  value: number;
  onChange: (value: number) => void;
  themeParams: TelegramThemeParams;
}

const formatSeedForDisplay = (seed: number): string => {
  return String(seed);
};

const parseSeedInput = (input: string): number => {
  if (!input || input.trim() === '') return 0;
  const cleanInput = input.replace(/[^0-9]/g, '');
  if (!cleanInput) return 0;
  
  // Convert to 7-digit number
  if (cleanInput.length < 7) {
    // If less than 7 digits, pad with leading digits starting with 1
    return Number('1' + cleanInput.padStart(6, '0'));
  }
  
  if (cleanInput.length > 7) {
    // If more than 7 digits, take first 7
    return Number(cleanInput.slice(0, 7));
  }
  
  // Exactly 7 digits
  const num = Number(cleanInput);
  if (num < 1000000) {
    // Ensure it starts with 1 if somehow less than 1000000
    return 1000000 + (num % 1000000);
  }
  return num;
};

export function SeedInput({ value, onChange, themeParams }: SeedInputProps) {
  const [showHelp, setShowHelp] = useState(false);

  const handleSeedChange = (input: string) => {
    onChange(parseSeedInput(input));
  };

  const handleRandomSeed = () => {
    onChange(generateFalSeed());
  };

  const handleClearSeed = () => {
    onChange(0);  // Just clear to 0
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label 
            className="block text-sm font-medium" 
            style={{ color: themeParams.text_color }}
          >
            Seed (Semilla)
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
            Mismo seed + prompt = misma imagen. Usa 0 para seed aleatorio.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formatSeedForDisplay(value)}
          onChange={(e) => handleSeedChange(e.target.value)}
          placeholder="0 para aleatorio"
          maxLength={7}
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
          title="Limpiar seed (usar 0 para aleatorio)"
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

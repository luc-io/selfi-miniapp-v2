import { useState } from 'react';
import { Info } from 'lucide-react';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

interface TrainingStepsProps {
  value: number;
  onChange: (value: number) => void;
}

export function TrainingSteps({ value, onChange }: TrainingStepsProps) {
  const themeParams = useTelegramTheme();
  const [showHelp, setShowHelp] = useState(false);

  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label 
            className="block text-sm font-medium" 
            style={labelStyle}
          >
            Pasos de entrenamiento
          </label>
          <span
            className="text-sm"
            style={hintStyle}
          >
            ({value})
          </span>
          <button 
            type="button" 
            className="hover:opacity-80 transition-opacity focus:outline-none"
            onClick={() => setShowHelp(!showHelp)}
            aria-label="Ver información de pasos de entrenamiento"
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
            style={hintStyle}
          >
            Cuántas veces el modelo refinará su entendimiento de las imágenes. Más pasos = mejor calidad pero más tiempo de entrenamiento y mayor coste en estrellas
          </p>
        )}
      </div>
      <input
        type="range"
        min={100}
        max={2000}
        step={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          backgroundColor: `${themeParams.button_color}60`,
          '--range-thumb-bg': themeParams.button_color,
        } as React.CSSProperties}
      />
      <div className="flex justify-between text-xs" style={hintStyle}>
        <span>100</span>
        <span>2000</span>
      </div>
    </div>
  );
}
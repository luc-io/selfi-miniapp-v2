import type { GenerationParameters } from '@/types';
import type { TelegramTheme } from '@/types';
import { SeedInput } from './SeedInput';

interface ImageParametersProps {
  params: GenerationParameters;
  updateParam: <K extends keyof GenerationParameters>(key: K, value: GenerationParameters[K]) => void;
  themeParams: TelegramTheme;
}

export function ImageParameters({ params, updateParam, themeParams }: ImageParametersProps) {
  const labelStyle = {
    color: themeParams.text_color,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold" style={labelStyle}>Image Parameters</h2>
      
      {/* Seed Input */}
      <SeedInput
        value={params.seed}
        onChange={(value) => updateParam('seed', value)}
        themeParams={themeParams}
      />

      {/* We'll add other parameter components here */}
    </div>
  );
}
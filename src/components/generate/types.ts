export interface ModelSelectorProps {
  defaultValue: string;
  onSelect: (modelPath: string) => void;
}

export interface AdvancedOptionsProps {
  onChange: (options: { negativePrompt?: string; seed?: number }) => void;
}
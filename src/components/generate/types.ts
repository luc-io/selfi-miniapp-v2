export interface ModelSelectorProps {
  defaultValue: string;
  onSelect: (modelPath: string) => void;
}
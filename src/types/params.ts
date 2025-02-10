export interface LoraOption {
  path: string;
  name: string;
  stars?: number;
}

export interface ParamsOption {
  name: string;
  default: string;
  description?: string;
  type: 'string' | 'number' | 'boolean';
  value?: string | number | boolean;
  loras?: LoraOption[];
}

export interface UserParameters {
  params: Record<string, ParamsOption>;
}
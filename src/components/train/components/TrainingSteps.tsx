import { Slider } from '@/components/ui/slider';

interface TrainingStepsProps {
  value: number;
  onChange: (value: number) => void;
}

export const TrainingSteps: React.FC<TrainingStepsProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700">Training Steps</label>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
      <Slider 
        value={[value]}
        onValueChange={v => onChange(v[0])}
        min={100}
        max={2000}
        step={100}
        className="py-2"
      />
    </div>
  );
};
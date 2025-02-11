import { useTelegramTheme } from '@/hooks/useTelegramTheme';
import type { UserInfo } from '@/lib/api';

interface CostDisplayProps {
  trainingCost: number;
  userInfo: UserInfo | null;
  hasEnoughStars: boolean;
}

export function CostDisplay({ trainingCost, userInfo, hasEnoughStars }: CostDisplayProps) {
  const themeParams = useTelegramTheme();

  const labelStyle = {
    color: themeParams.text_color,
  };

  const hintStyle = {
    color: themeParams.hint_color,
  };

  const balanceStyle = {
    color: hasEnoughStars ? '#34C759' : '#FF3B30',
  };

  const costStyle = {
    color: themeParams.button_color,
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold" style={labelStyle}>Train Model</h2>
        <div className="text-sm" style={hintStyle}>
          Training Cost: <span style={costStyle}>{trainingCost} ⭐</span>
        </div>
      </div>

      {userInfo && (
        <div className="text-sm" style={hintStyle}>
          Your Balance:{' '}
          <span style={balanceStyle} className="font-semibold">
            {userInfo.stars} ⭐
          </span>
        </div>
      )}
    </div>
  );
}

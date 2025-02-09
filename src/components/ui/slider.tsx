import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const themeParams = useTelegramTheme();

  const sliderTrackStyle = {
    backgroundColor: `${themeParams.button_color}20`, // 20% opacity
  };

  const sliderRangeStyle = {
    backgroundColor: themeParams.button_color,
  };

  const sliderThumbStyle = {
    backgroundColor: themeParams.button_color,
    border: `2px solid ${themeParams.bg_color}`,
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className="relative flex w-full touch-none select-none items-center"
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-1.5 w-full grow overflow-hidden rounded-full"
        style={sliderTrackStyle}
      >
        <SliderPrimitive.Range
          className="absolute h-full"
          style={sliderRangeStyle}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-4 w-4 rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        style={sliderThumbStyle}
      />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
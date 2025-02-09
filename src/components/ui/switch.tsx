import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { useTelegramTheme } from '@/hooks/useTelegramTheme';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const themeParams = useTelegramTheme();

  const rootStyle = {
    backgroundColor: props.checked ? themeParams.button_color : `${themeParams.button_color}20`,
  };

  const thumbStyle = {
    backgroundColor: themeParams.bg_color,
  };

  return (
    <SwitchPrimitives.Root
      className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
      {...props}
      ref={ref}
      style={rootStyle}
    >
      <SwitchPrimitives.Thumb
        className="pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        style={thumbStyle}
      />
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
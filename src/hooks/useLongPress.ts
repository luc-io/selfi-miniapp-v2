interface LongPressOptions {
  threshold?: number;
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

export function useLongPress({ 
  threshold = 500,
  onStart,
  onFinish,
  onCancel 
}: LongPressOptions = {}) {
  let timeoutId: NodeJS.Timeout | null = null;
  let longPressDetected = false;

  const start = (event: React.TouchEvent | React.MouseEvent) => {
    if (event.type === 'mousedown' && 'button' in event && event.button !== 0) {
      return; // Only handle left clicks
    }

    longPressDetected = false;
    onStart?.();

    timeoutId = setTimeout(() => {
      longPressDetected = true;
      onFinish?.();
    }, threshold);
  };

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    if (!longPressDetected) {
      onCancel?.();
    }
  };

  return {
    handlers: {
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
      onTouchStart: start,
      onTouchEnd: cancel,
    },
  };
}
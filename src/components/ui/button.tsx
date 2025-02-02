interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'default';
}

export function Button({ variant = 'default', className = '', children, ...props }: ButtonProps) {
  const baseClasses = 'font-medium flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const variantClasses = variant === 'outline'
    ? 'border border-gray-300 bg-white hover:bg-gray-50'
    : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
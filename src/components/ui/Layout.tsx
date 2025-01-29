import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Layout({ children, className, ...props }: LayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 py-8 max-w-2xl', className)} {...props}>
      {children}
    </div>
  );
}

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center justify-center gap-2 rounded-md px-3 py-1.5',
            'text-sm font-medium transition-all',
            'hover:bg-white hover:shadow-sm',
            activeTab === tab.id
              ? 'bg-white shadow-sm'
              : 'text-gray-600'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        'disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          'border border-gray-200 bg-white hover:bg-gray-50': variant === 'outline',
          'h-9 px-4 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-11 px-8': size === 'lg',
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={cn({ 'opacity-0': isLoading })}>{children}</span>
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={cn(
          'block w-full rounded-md border border-gray-300 bg-white px-3 py-2',
          'text-sm placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:opacity-50 disabled:bg-gray-50',
          { 'border-red-300 focus:border-red-500 focus:ring-red-500': error },
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'block w-full rounded-md border border-gray-300 bg-white px-3 py-2',
          'text-sm placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'disabled:opacity-50 disabled:bg-gray-50',
          { 'border-red-300 focus:border-red-500 focus:ring-red-500': error },
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string | null;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
  if (!message) return null;

  return (
    <Alert variant="destructive" style={{
      backgroundColor: '#FF3B3020',
      color: '#FF3B30',
      borderColor: '#FF3B3040'
    }}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStars(stars: number) {
  return `${stars}⭐`;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  const data = await response.json();
  return data.url;
}

export async function uploadMultipleFiles(files: File[]): Promise<string[]> {
  const uploads = files.map(file => uploadFile(file));
  return Promise.all(uploads);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
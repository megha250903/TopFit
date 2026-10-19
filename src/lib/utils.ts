import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toUpperCase() : 'FILE'
}

export function getMatchLabel(score: number): {
  label: string
  colorClass: string
  badgeBg: string
} {
  if (score >= 75) {
    return {
      label: 'Strong match',
      colorClass: 'text-success border-success/30 bg-success-light',
      badgeBg: 'bg-success text-white',
    }
  } else if (score >= 50) {
    return {
      label: 'Possible match',
      colorClass: 'text-berry border-berry/30 bg-petal',
      badgeBg: 'bg-berry text-white',
    }
  } else {
    return {
      label: 'Weak match',
      colorClass: 'text-muted border-muted/30 bg-petal/40',
      badgeBg: 'bg-muted text-white',
    }
  }
}

import { formatDistance as formatDistanceDate, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Format duration in minutes to hours and minutes (e.g., "2ч 15м")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 1) return '0м';
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) return `${mins}м`;
  if (mins === 0) return `${hours}ч`;
  
  return `${hours}ч ${mins}м`;
}

/**
 * Format distance in kilometers
 */
export function formatKm(km: number): string {
  return `${km.toFixed(1)} км`;
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format relative time (e.g., "5 минут назад")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ru });
}

/**
 * Format phone number (Armenian format)
 */
export function formatPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Armenian format: +374-XX-XXXXXX
  if (digits.startsWith('374') && digits.length === 11) {
    return `+374-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }
  
  // If already formatted or different format, return as is
  return phone;
}

/**
 * Format address (truncate if too long)
 */
export function formatAddress(address: string, maxLength: number = 50): string {
  if (address.length <= maxLength) return address;
  return `${address.substring(0, maxLength)}...`;
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lon: number): string {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format completion ratio (e.g., "45/60")
 */
export function formatRatio(completed: number, total: number): string {
  return `${completed}/${total}`;
}

/**
 * Format completion percentage with color indicator
 */
export function getCompletionStatus(completed: number, total: number): {
  percentage: number;
  status: 'low' | 'medium' | 'high' | 'complete';
} {
  if (total === 0) return { percentage: 0, status: 'low' };
  
  const percentage = (completed / total) * 100;
  
  let status: 'low' | 'medium' | 'high' | 'complete';
  if (percentage === 100) status = 'complete';
  else if (percentage >= 75) status = 'high';
  else if (percentage >= 50) status = 'medium';
  else status = 'low';
  
  return { percentage, status };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Format driver name (Last name + First initial)
 */
export function formatDriverName(firstName: string, lastName: string, short: boolean = false): string {
  if (short) {
    return `${lastName} ${firstName.charAt(0)}.`;
  }
  return `${firstName} ${lastName}`;
}



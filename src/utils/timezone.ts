// Simplified timezone utilities for deployment

// Timezone mappings for regions
export const TIMEZONES: Record<string, string> = {
  AM: 'Asia/Yerevan',
  US: 'America/New_York',
  EU: 'Europe/Berlin',
  RU: 'Europe/Moscow'
};

const DEFAULT_TIMEZONE = 'Asia/Yerevan';

export function getTimezoneByRegion(regionCode: string): string {
  return TIMEZONES[regionCode] || DEFAULT_TIMEZONE;
}

export function formatInTimezone(dateObj: Date, _tz: string, _formatString: string): string {
  return dateObj.toLocaleString('ru-RU');
}

export function formatForHub(date: Date | string, _hubRegionCode: string, _formatString = 'HH:mm dd.MM.yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('ru-RU');
}

export function convertToTimezone(date: Date | string, _timezone: string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj;
}

export function convertFromTimezone(date: Date, _timezone: string): Date {
  return date;
}

export function getCurrentTimeInTimezone(_timezone: string): Date {
  return new Date();
}

export function formatTimeInTimezone(dateObj: Date, _timezone: string): string {
  return dateObj.toLocaleTimeString('ru-RU');
}

export function formatDateInTimezone(dateObj: Date, _timezone: string): string {
  return dateObj.toLocaleDateString('ru-RU');
}

export function formatDateTimeInTimezone(dateObj: Date, _timezone: string): string {
  return dateObj.toLocaleString('ru-RU');
}
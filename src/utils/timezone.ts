import { format, formatInTimeZone } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// Timezone mappings for regions
export const TIMEZONES: Record<string, string> = {
  AM: 'Asia/Yerevan',
  US: 'America/New_York',
  CN: 'Asia/Shanghai'
};

// Default timezone (Armenia)
export const DEFAULT_TIMEZONE = TIMEZONES.AM;

/**
 * Get timezone by region code
 */
export function getTimezoneByRegion(regionCode: string): string {
  return TIMEZONES[regionCode] || DEFAULT_TIMEZONE;
}

/**
 * Format date for a specific hub/region
 */
export function formatForHub(date: Date | string, hubRegionCode: string, formatString = 'HH:mm dd.MM.yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const tz = getTimezoneByRegion(hubRegionCode);
  return formatInTimeZone(dateObj, tz, formatString);
}

/**
 * Format date in Armenia timezone (default)
 */
export function formatInArmeniaTime(date: Date | string, formatString = 'HH:mm dd.MM.yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, DEFAULT_TIMEZONE, formatString);
}

/**
 * Convert UTC date to specific timezone
 */
export function toTimezone(date: Date | string, timezone: string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return utcToZonedTime(dateObj, timezone);
}

/**
 * Convert date from timezone to UTC
 */
export function toUTC(date: Date, timezone: string): Date {
  return zonedTimeToUtc(date, timezone);
}

/**
 * Get current time in specific timezone
 */
export function nowInTimezone(timezone: string = DEFAULT_TIMEZONE): Date {
  return utcToZonedTime(new Date(), timezone);
}

/**
 * Format time only (HH:mm)
 */
export function formatTime(date: Date | string, timezone: string = DEFAULT_TIMEZONE): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, timezone, 'HH:mm');
}

/**
 * Format date only (dd.MM.yyyy)
 */
export function formatDate(date: Date | string, timezone: string = DEFAULT_TIMEZONE): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, timezone, 'dd.MM.yyyy');
}

/**
 * Format full datetime (dd.MM.yyyy HH:mm)
 */
export function formatDateTime(date: Date | string, timezone: string = DEFAULT_TIMEZONE): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, timezone, 'dd.MM.yyyy HH:mm');
}



// Units conversion utilities
// Base units: km (kilometers) and liters

// ===== Distance Conversion =====

/**
 * Convert miles to kilometers
 */
export function milesToKm(miles: number): number {
  return miles * 1.60934;
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km: number): number {
  return km / 1.60934;
}

/**
 * Format distance in kilometers
 */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} км`;
}

/**
 * Format distance in miles
 */
export function formatDistanceMiles(miles: number): string {
  return `${miles.toFixed(1)} миль`;
}

// ===== Volume Conversion (Fuel) =====

/**
 * Convert US gallons to liters
 */
export function gallonsToLiters(gallons: number): number {
  return gallons * 3.78541;
}

/**
 * Convert liters to US gallons
 */
export function litersToGallons(liters: number): number {
  return liters / 3.78541;
}

/**
 * Format volume in liters
 */
export function formatVolume(liters: number): string {
  return `${liters.toFixed(1)} л`;
}

/**
 * Format volume in gallons
 */
export function formatVolumeGallons(gallons: number): string {
  return `${gallons.toFixed(1)} gal`;
}

// ===== Speed Conversion =====

/**
 * Convert mph to km/h
 */
export function mphToKmh(mph: number): number {
  return mph * 1.60934;
}

/**
 * Convert km/h to mph
 */
export function kmhToMph(kmh: number): number {
  return kmh / 1.60934;
}

/**
 * Format speed in km/h
 */
export function formatSpeed(kmh: number): string {
  return `${kmh.toFixed(0)} км/ч`;
}

/**
 * Format speed in mph
 */
export function formatSpeedMph(mph: number): string {
  return `${mph.toFixed(0)} mph`;
}



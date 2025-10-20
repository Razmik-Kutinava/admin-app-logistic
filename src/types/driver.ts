export enum DriverStatus {
  ONLINE = 'ONLINE',
  DRIVING = 'DRIVING',
  IDLE = 'IDLE',
  OFFLINE = 'OFFLINE'
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  hub_id: string;
  status: DriverStatus;
  region?: string;
  created_at: string;
}

export interface DriverWithStats extends Driver {
  // Today's statistics
  completed_stops: number;
  total_stops: number;
  total_km: number;
  idle_minutes: number;
  online_minutes: number;
  issues_count: number;
  fuel_used?: number;
  district_id?: string;
  last_gps?: {
    lat: number;
    lon: number;
    ts: string;
  };
  // District information
  district?: {
    id: string;
    name_ru: string;
    name_hy?: string;
    center_lat: number;
    center_lon: number;
  };
  // Today's stats (for UI)
  todayStats?: {
    deliveredStops: number;
    totalStops: number;
    idleTimeMinutes: number;
    distanceKm: number;
    fuelLiters: number;
    issuesCount: number;
  };
  lastSeen?: string;
}

export interface DriverDayMetrics {
  driver_id: string;
  date: string;
  completed_stops: number;
  total_stops: number;
  total_km: number;
  idle_minutes: number;
  online_minutes: number;
  driving_minutes: number;
  issues_count: number;
  fuel_used?: number;
}



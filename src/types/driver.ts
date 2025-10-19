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
  last_gps?: {
    lat: number;
    lon: number;
    ts: string;
  };
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



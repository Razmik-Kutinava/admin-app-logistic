export const RouteStatus = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

export type RouteStatus = typeof RouteStatus[keyof typeof RouteStatus];

export const StopStatus = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  ISSUE: 'ISSUE'
} as const;

export type StopStatus = typeof StopStatus[keyof typeof StopStatus];

export interface Route {
  id: string;
  driver_id: string;
  vehicle_id: string;
  date: string;
  status: RouteStatus;
  total_stops: number;
  completed_stops: number;
  total_km: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Stop {
  id: string;
  route_id: string;
  client_id: string;
  seq: number;
  address: string;
  lat: number;
  lon: number;
  planned_ts: string;
  status: StopStatus;
  arrived_at?: string;
  completed_at?: string;
  idle_minutes: number;
  epod_photo_url?: string;
  epod_signature_url?: string;
  created_at: string;
}

export interface RouteWithDetails extends Route {
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  vehicle?: {
    id: string;
    plate_number: string;
    model: string;
  };
  stops?: Stop[];
  issues_count?: number;
}



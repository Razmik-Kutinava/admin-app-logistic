// ===== Common Types =====

export interface Region {
  id: string;
  code: 'AM' | 'US' | 'CN';
  name_ru: string;
  timezone: string;
  created_at: string;
}

export interface Hub {
  id: string;
  region_id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  region_id: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  plate_number: string;
  model: string;
  year: number;
  hub_id: string;
  last_maintenance_km?: number;
  last_maintenance_date?: string;
  created_at: string;
}

export interface GPSTrack {
  id: string;
  driver_id: string;
  vehicle_id: string;
  ts: string;
  lat: number;
  lon: number;
  speed: number;
  fuel_level?: number;
  created_at: string;
}

export interface Event {
  id: string;
  driver_id?: string;
  route_id?: string;
  stop_id?: string;
  event_type: EventType;
  ts: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export const EventType = {
  START_DAY: 'START_DAY',
  END_DAY: 'END_DAY',
  START_STOP: 'START_STOP',
  END_STOP: 'END_STOP',
  ISSUE_CREATED: 'ISSUE_CREATED',
  GPS_LOST: 'GPS_LOST',
  GPS_RESTORED: 'GPS_RESTORED',
  EPOD_UPLOADED: 'EPOD_UPLOADED'
} as const;

export type EventType = typeof EventType[keyof typeof EventType];

// Re-export specific types
export * from './driver';
export * from './route';
export * from './metrics';
export * from './alert';
export * from './issue';



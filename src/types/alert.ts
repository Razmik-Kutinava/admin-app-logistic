export const AlertType = {
  LONG_IDLE: 'LONG_IDLE',
  TOO_MANY_ISSUES: 'TOO_MANY_ISSUES',
  MAINTENANCE_DUE: 'MAINTENANCE_DUE',
  GPS_LOST: 'GPS_LOST',
  ROUTE_DELAYED: 'ROUTE_DELAYED'
} as const;

export type AlertType = typeof AlertType[keyof typeof AlertType];

export const AlertSeverity = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
} as const;

export type AlertSeverity = typeof AlertSeverity[keyof typeof AlertSeverity];

export interface Alert {
  id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  driver_id?: string;
  vehicle_id?: string;
  message: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  created_at: string;
}

export interface AlertWithDetails extends Alert {
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  vehicle?: {
    id: string;
    plate_number: string;
  };
  last_gps?: {
    lat: number;
    lon: number;
  };
}

export interface AlertAction {
  type: 'call' | 'chat' | 'map' | 'acknowledge';
  label: string;
  icon: string;
}



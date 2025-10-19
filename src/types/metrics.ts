export interface KPIMetrics {
  drivers_online: number;
  drivers_online_trend: number[]; // Sparkline data for the day
  
  completed_addresses: number;
  completed_addresses_trend: number[]; // Sparkline data
  
  avg_idle_minutes: number;
  idle_threshold: number; // Warning threshold
  idle_status: 'normal' | 'warning' | 'critical';
  
  total_km: number;
  total_km_by_hour: number[]; // 24 hours
}

export interface OperationsStats {
  // Status breakdown by hour (24 hours)
  planned_by_hour: number[];
  in_progress_by_hour: number[];
  completed_by_hour: number[];
  cancelled_by_hour: number[];
  issue_by_hour: number[];
  
  // Idle heatmap: [driver_id, hour, minutes]
  idle_heatmap: Array<{
    driver_id: string;
    driver_name: string;
    hour: number;
    idle_minutes: number;
  }>;
  
  // Issue Pareto data
  issues_by_type: Array<{
    type: string;
    count: number;
    percentage: number;
    cumulative_percentage: number;
  }>;
}

export interface DriverMetrics {
  driver_id: string;
  date: string;
  
  // Main metrics
  completed_stops: number;
  total_stops: number;
  total_km: number;
  idle_minutes: number;
  online_minutes: number;
  driving_minutes: number;
  issues_count: number;
  fuel_used?: number;
  
  // Hourly breakdowns for charts
  idle_by_hour: number[]; // 24 hours
  km_by_hour: number[]; // 24 hours (cumulative)
  fuel_by_hour?: number[]; // 24 hours
  
  // Avg comparison
  avg_fuel_consumption?: number;
  fuel_vs_avg?: number; // Percentage difference
}

export interface FleetMetrics {
  total_vehicles: number;
  active_vehicles: number;
  maintenance_due: number;
  maintenance_overdue: number;
  
  vehicles: Array<{
    id: string;
    plate_number: string;
    model: string;
    status: 'active' | 'idle' | 'maintenance';
    current_km: number;
    next_maintenance_km: number;
    km_until_maintenance: number;
    days_until_maintenance?: number;
  }>;
}

export interface PeriodData {
  period: string;
  drivers_online: number;
  completed_addresses: number;
  avg_idle_minutes: number;
  total_km: number;
}



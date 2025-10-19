// ===== Alert Thresholds =====

export const ALERT_THRESHOLDS = {
  // Long idle threshold (minutes)
  LONG_IDLE_MINUTES: 60,
  
  // Too many issues threshold
  MAX_ISSUES_PER_HOUR: 3,
  
  // Maintenance thresholds
  MAINTENANCE_WARNING_KM: 500, // Warn 500 km before due
  MAINTENANCE_WARNING_DAYS: 7, // Warn 7 days before due
  
  // GPS tracking
  GPS_LOST_MINUTES: 15, // Consider GPS lost after 15 min without signal
  
  // Route delay
  ROUTE_DELAY_MINUTES: 30 // Warn if route is 30+ min behind schedule
};

// ===== Unit Economics (as per RDP) =====

export const UNIT_ECONOMICS = {
  // Monthly norms
  MONTHLY_ADDRESSES_NORM: 1800, // Expected addresses per driver per month
  MONTHLY_SALARY_AMD: 250000, // Base salary in AMD
  
  // Cost per additional address beyond norm
  ADDITIONAL_ADDRESS_COST_AMD: 150,
  
  // Calculate cost per address based on norm
  get COST_PER_ADDRESS_AMD() {
    return this.MONTHLY_SALARY_AMD / this.MONTHLY_ADDRESSES_NORM;
  }
};

// ===== Maintenance Schedule =====

export const MAINTENANCE_SCHEDULE = {
  TO1_KM: 10000, // TO-1 every 10,000 km
  TO1_MONTHS: 6, // or every 6 months
  
  TO2_KM: 20000, // TO-2 every 20,000 km
  TO2_MONTHS: 12 // or every 12 months
};

// ===== Update Intervals (milliseconds) =====

export const UPDATE_INTERVALS = {
  KPI_METRICS: 30000, // 30 seconds
  GPS_TRACKS: 15000, // 15 seconds (can be 30000 for slower updates)
  DRIVER_TABLE: 30000, // 30 seconds
  ALERT_TRIGGERS: 300000, // 5 minutes
  MAP_REFRESH: 30000 // 30 seconds
};

// ===== Map Configuration =====

export const MAP_CONFIG = {
  // Default center (Yerevan, Armenia)
  DEFAULT_CENTER: {
    lat: 40.1776,
    lon: 44.5126
  },
  
  DEFAULT_ZOOM: 12,
  
  // Cluster settings
  CLUSTER_DISTANCE: 80, // pixels
  CLUSTER_MAX_ZOOM: 15,
  
  // Heatmap settings
  HEATMAP_RADIUS: 25,
  HEATMAP_BLUR: 15,
  HEATMAP_MAX_ZOOM: 17
};

// ===== Status Colors =====

export const STATUS_COLORS = {
  // Driver statuses
  ONLINE: '#34C759', // Green
  DRIVING: '#007AFF', // Blue
  IDLE: '#FF9500', // Orange
  OFFLINE: '#8E8E93', // Gray
  
  // Stop/Route statuses
  PLANNED: '#8E8E93', // Gray
  IN_PROGRESS: '#007AFF', // Blue
  COMPLETED: '#34C759', // Green
  DELIVERED: '#34C759', // Green
  CANCELLED: '#8E8E93', // Gray
  ISSUE: '#FF3B30', // Red
  
  // Alert severities
  ALERT_INFO: '#007AFF', // Blue
  ALERT_WARNING: '#FF9500', // Orange
  ALERT_CRITICAL: '#FF3B30', // Red
  
  // UI colors
  PRIMARY: '#007AFF',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  DANGER: '#FF3B30',
  BACKGROUND: '#F5F5F7',
  CARD: '#FFFFFF',
  TEXT: '#1C1C1E',
  TEXT_SECONDARY: '#8E8E93'
};

// ===== Table Pagination =====

export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// ===== Export Formats =====

export const EXPORT_FORMATS = ['CSV', 'XLSX', 'PDF'] as const;

// ===== Date Formats =====

export const DATE_FORMATS = {
  DISPLAY: 'dd.MM.yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd.MM.yyyy HH:mm',
  DATETIME_FULL: 'dd.MM.yyyy HH:mm:ss',
  MONTH_YEAR: 'MMMM yyyy',
  API: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
};

// ===== Mock Data Generation =====

export const MOCK_CONFIG = {
  // GPS simulation for Yerevan area
  YEREVAN_LAT_MIN: 40.17,
  YEREVAN_LAT_MAX: 40.19,
  YEREVAN_LON_MIN: 44.50,
  YEREVAN_LON_MAX: 44.53,
  
  // Speed range (km/h)
  SPEED_MIN: 20,
  SPEED_MAX: 60,
  
  // GPS update frequency (seconds)
  GPS_UPDATE_INTERVAL: 30,
  
  // Issue generation
  ISSUES_PER_DAY_MIN: 5,
  ISSUES_PER_DAY_MAX: 10,
  
  // Issue type distribution
  ISSUE_TYPES_DISTRIBUTION: {
    TRAFFIC: 0.6, // 60%
    NO_SHOW: 0.2, // 20%
    BAD_ADDRESS: 0.1, // 10%
    OTHER: 0.1 // 10%
  }
};


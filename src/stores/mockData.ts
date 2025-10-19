// Mock data for development without Supabase
import type { DriverWithStats } from '../types/driver';
import type { AlertWithDetails } from '../types/alert';
import type { RouteWithDetails } from '../types/route';
import { DriverStatus } from '../types/driver';

// Mock drivers data
export const mockDrivers: DriverWithStats[] = [
  {
    id: '1',
    first_name: 'Арам',
    last_name: 'Петросян',
    phone: '+374-91-123456',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    created_at: new Date().toISOString(),
    completed_stops: 12,
    total_stops: 15,
    total_km: 45.5,
    idle_minutes: 25,
    online_minutes: 180,
    issues_count: 1,
    last_gps: { lat: 40.1776, lon: 44.5126, ts: new Date().toISOString() }
  },
  {
    id: '2',
    first_name: 'Гарик',
    last_name: 'Саркисян',
    phone: '+374-91-234567',
    hub_id: 'hub-1',
    status: DriverStatus.DRIVING,
    created_at: new Date().toISOString(),
    completed_stops: 18,
    total_stops: 20,
    total_km: 62.3,
    idle_minutes: 15,
    online_minutes: 240,
    issues_count: 0,
    last_gps: { lat: 40.1820, lon: 44.5100, ts: new Date().toISOString() }
  },
  {
    id: '3',
    first_name: 'Ваге',
    last_name: 'Аветисян',
    phone: '+374-91-345678',
    hub_id: 'hub-1',
    status: DriverStatus.IDLE,
    created_at: new Date().toISOString(),
    completed_stops: 8,
    total_stops: 12,
    total_km: 28.7,
    idle_minutes: 75,
    online_minutes: 150,
    issues_count: 2,
    last_gps: { lat: 40.1695, lon: 44.5250, ts: new Date().toISOString() }
  },
  {
    id: '4',
    first_name: 'Давид',
    last_name: 'Мартиросян',
    phone: '+374-91-456789',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    created_at: new Date().toISOString(),
    completed_stops: 14,
    total_stops: 18,
    total_km: 51.2,
    idle_minutes: 30,
    online_minutes: 210,
    issues_count: 1,
    last_gps: { lat: 40.1850, lon: 44.5080, ts: new Date().toISOString() }
  },
  {
    id: '5',
    first_name: 'Сурен',
    last_name: 'Григорян',
    phone: '+374-91-567890',
    hub_id: 'hub-1',
    status: DriverStatus.OFFLINE,
    created_at: new Date().toISOString(),
    completed_stops: 0,
    total_stops: 0,
    total_km: 0,
    idle_minutes: 0,
    online_minutes: 0,
    issues_count: 0
  },
  {
    id: '6',
    first_name: 'Тигран',
    last_name: 'Акопян',
    phone: '+374-91-678901',
    hub_id: 'hub-1',
    status: DriverStatus.DRIVING,
    created_at: new Date().toISOString(),
    completed_stops: 10,
    total_stops: 15,
    total_km: 38.9,
    idle_minutes: 20,
    online_minutes: 180,
    issues_count: 0,
    last_gps: { lat: 40.1730, lon: 44.5190, ts: new Date().toISOString() }
  },
  {
    id: '7',
    first_name: 'Армен',
    last_name: 'Овсепян',
    phone: '+374-91-789012',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    created_at: new Date().toISOString(),
    completed_stops: 16,
    total_stops: 18,
    total_km: 55.8,
    idle_minutes: 18,
    online_minutes: 220,
    issues_count: 0,
    last_gps: { lat: 40.1790, lon: 44.5140, ts: new Date().toISOString() }
  },
  {
    id: '8',
    first_name: 'Левон',
    last_name: 'Варданян',
    phone: '+374-91-890123',
    hub_id: 'hub-1',
    status: DriverStatus.IDLE,
    created_at: new Date().toISOString(),
    completed_stops: 7,
    total_stops: 10,
    total_km: 22.4,
    idle_minutes: 45,
    online_minutes: 120,
    issues_count: 1,
    last_gps: { lat: 40.1760, lon: 44.5170, ts: new Date().toISOString() }
  },
  {
    id: '9',
    first_name: 'Карен',
    last_name: 'Мкртчян',
    phone: '+374-91-901234',
    hub_id: 'hub-1',
    status: DriverStatus.DRIVING,
    created_at: new Date().toISOString(),
    completed_stops: 20,
    total_stops: 22,
    total_km: 68.5,
    idle_minutes: 12,
    online_minutes: 260,
    issues_count: 0,
    last_gps: { lat: 40.1880, lon: 44.5050, ts: new Date().toISOString() }
  },
  {
    id: '10',
    first_name: 'Арсен',
    last_name: 'Асатрян',
    phone: '+374-91-012345',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    created_at: new Date().toISOString(),
    completed_stops: 13,
    total_stops: 16,
    total_km: 47.3,
    idle_minutes: 28,
    online_minutes: 195,
    issues_count: 1,
    last_gps: { lat: 40.1800, lon: 44.5130, ts: new Date().toISOString() }
  }
];

// Mock alerts data
export const mockAlerts: AlertWithDetails[] = [
  {
    id: 'alert-1',
    alert_type: 'LONG_IDLE',
    severity: 'WARNING',
    driver_id: '3',
    message: 'Водитель Ваге Аветисян в простое более 75 минут',
    acknowledged: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    driver: {
      id: '3',
      first_name: 'Ваге',
      last_name: 'Аветисян',
      phone: '+374-91-345678'
    },
    last_gps: { lat: 40.1695, lon: 44.5250 }
  },
  {
    id: 'alert-2',
    alert_type: 'TOO_MANY_ISSUES',
    severity: 'INFO',
    driver_id: '3',
    message: 'У водителя Ваге Аветисян 2 проблемы за последний час',
    acknowledged: false,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    driver: {
      id: '3',
      first_name: 'Ваге',
      last_name: 'Аветисян',
      phone: '+374-91-345678'
    },
    last_gps: { lat: 40.1695, lon: 44.5250 }
  }
];

// Mock routes (optional, for future use)
export const mockRoutes: RouteWithDetails[] = [];



// Mock data for development without Supabase
import type { DriverWithStats } from '../types/driver';
import type { AlertWithDetails } from '../types/alert';
import type { RouteWithDetails } from '../types/route';
import { DriverStatus } from '../types/driver';
import { AlertType, AlertSeverity } from '../types/alert';

// Mock drivers data
export const mockDrivers: DriverWithStats[] = [
  {
    id: '1',
    first_name: 'Арам',
    last_name: 'Петросян',
    phone: '+374-91-123456',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    region: 'Кентрон',
    district_id: '1',
    created_at: new Date().toISOString(),
    completed_stops: 12,
    total_stops: 15,
    total_km: 45.5,
    idle_minutes: 25,
    online_minutes: 180,
    issues_count: 1,
    last_gps: { lat: 40.1776, lon: 44.5126, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 12,
      totalStops: 15,
      idleTimeMinutes: 25,
      distanceKm: 45.5,
      fuelLiters: 8.2,
      issuesCount: 1
    }
  },
  {
    id: '2',
    first_name: 'Гарик',
    last_name: 'Саркисян',
    phone: '+374-91-234567',
    hub_id: 'hub-1',
    status: DriverStatus.DRIVING,
    region: 'Арабкир',
    district_id: '2',
    created_at: new Date().toISOString(),
    completed_stops: 18,
    total_stops: 20,
    total_km: 62.3,
    idle_minutes: 15,
    online_minutes: 240,
    issues_count: 0,
    last_gps: { lat: 40.1820, lon: 44.5100, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 18,
      totalStops: 20,
      idleTimeMinutes: 15,
      distanceKm: 62.3,
      fuelLiters: 10.5,
      issuesCount: 0
    }
  },
  {
    id: '3',
    first_name: 'Ваге',
    last_name: 'Аветисян',
    phone: '+374-91-345678',
    hub_id: 'hub-1',
    status: DriverStatus.IDLE,
    region: 'Аван',
    district_id: '3',
    created_at: new Date().toISOString(),
    completed_stops: 8,
    total_stops: 12,
    total_km: 28.7,
    idle_minutes: 75,
    online_minutes: 150,
    issues_count: 2,
    last_gps: { lat: 40.1695, lon: 44.5250, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 8,
      totalStops: 12,
      idleTimeMinutes: 75,
      distanceKm: 28.7,
      fuelLiters: 5.8,
      issuesCount: 2
    }
  },
  {
    id: '4',
    first_name: 'Давид',
    last_name: 'Мартиросян',
    phone: '+374-91-456789',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    region: 'Эребуни',
    district_id: '6',
    created_at: new Date().toISOString(),
    completed_stops: 14,
    total_stops: 18,
    total_km: 51.2,
    idle_minutes: 30,
    online_minutes: 210,
    issues_count: 1,
    last_gps: { lat: 40.1850, lon: 44.5080, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 14,
      totalStops: 18,
      idleTimeMinutes: 30,
      distanceKm: 51.2,
      fuelLiters: 9.1,
      issuesCount: 1
    }
  },
  {
    id: '5',
    first_name: 'Сурен',
    last_name: 'Григорян',
    phone: '+374-91-567890',
    hub_id: 'hub-1',
    status: DriverStatus.OFFLINE,
    region: 'Малатия-Себастия',
    district_id: '8',
    created_at: new Date().toISOString(),
    completed_stops: 0,
    total_stops: 0,
    total_km: 0,
    idle_minutes: 0,
    online_minutes: 0,
    issues_count: 0,
    todayStats: {
      deliveredStops: 0,
      totalStops: 0,
      idleTimeMinutes: 0,
      distanceKm: 0,
      fuelLiters: 0,
      issuesCount: 0
    }
  },
  {
    id: '6',
    first_name: 'Тигран',
    last_name: 'Акопян',
    phone: '+374-91-678901',
    hub_id: 'hub-1',
    status: DriverStatus.DRIVING,
    region: 'Шенгавит',
    district_id: '9',
    created_at: new Date().toISOString(),
    completed_stops: 10,
    total_stops: 15,
    total_km: 38.9,
    idle_minutes: 20,
    online_minutes: 180,
    issues_count: 0,
    last_gps: { lat: 40.1730, lon: 44.5190, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 10,
      totalStops: 15,
      idleTimeMinutes: 20,
      distanceKm: 38.9,
      fuelLiters: 7.3,
      issuesCount: 0
    }
  },
  {
    id: '7',
    first_name: 'Армен',
    last_name: 'Овсепян',
    phone: '+374-91-789012',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    region: 'Нор-Норк',
    district_id: '10',
    created_at: new Date().toISOString(),
    completed_stops: 16,
    total_stops: 18,
    total_km: 55.8,
    idle_minutes: 18,
    online_minutes: 220,
    issues_count: 0,
    last_gps: { lat: 40.1790, lon: 44.5140, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 16,
      totalStops: 18,
      idleTimeMinutes: 18,
      distanceKm: 55.8,
      fuelLiters: 11.2,
      issuesCount: 0
    }
  },
  {
    id: '8',
    first_name: 'Левон',
    last_name: 'Варданян',
    phone: '+374-91-890123',
    hub_id: 'hub-1',
    status: DriverStatus.IDLE,
    region: 'Кентрон',
    district_id: '1',
    created_at: new Date().toISOString(),
    completed_stops: 7,
    total_stops: 10,
    total_km: 22.4,
    idle_minutes: 45,
    online_minutes: 120,
    issues_count: 1,
    last_gps: { lat: 40.1760, lon: 44.5170, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 7,
      totalStops: 10,
      idleTimeMinutes: 45,
      distanceKm: 22.4,
      fuelLiters: 4.5,
      issuesCount: 1
    }
  },
  {
    id: '9',
    first_name: 'Карен',
    last_name: 'Мкртчян',
    phone: '+374-91-901234',
    hub_id: 'hub-1',
    status: DriverStatus.DRIVING,
    region: 'Арабкир',
    district_id: '2',
    created_at: new Date().toISOString(),
    completed_stops: 20,
    total_stops: 22,
    total_km: 68.5,
    idle_minutes: 12,
    online_minutes: 260,
    issues_count: 0,
    last_gps: { lat: 40.1880, lon: 44.5050, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 20,
      totalStops: 22,
      idleTimeMinutes: 12,
      distanceKm: 68.5,
      fuelLiters: 13.7,
      issuesCount: 0
    }
  },
  {
    id: '10',
    first_name: 'Арсен',
    last_name: 'Асатрян',
    phone: '+374-91-012345',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    region: 'Аван',
    district_id: '3',
    created_at: new Date().toISOString(),
    completed_stops: 13,
    total_stops: 16,
    total_km: 47.3,
    idle_minutes: 28,
    online_minutes: 195,
    issues_count: 1,
    last_gps: { lat: 40.1800, lon: 44.5130, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 13,
      totalStops: 16,
      idleTimeMinutes: 28,
      distanceKm: 47.3,
      fuelLiters: 9.5,
      issuesCount: 1
    }
  },
  {
    id: '11',
    first_name: 'Рубен',
    last_name: 'Манукян',
    phone: '+374-91-123789',
    hub_id: 'hub-1',
    status: DriverStatus.IDLE,
    region: 'Эребуни',
    district_id: '6',
    created_at: new Date().toISOString(),
    completed_stops: 9,
    total_stops: 12,
    total_km: 35.2,
    idle_minutes: 60,
    online_minutes: 160,
    issues_count: 2,
    last_gps: { lat: 40.1860, lon: 44.5070, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 9,
      totalStops: 12,
      idleTimeMinutes: 60,
      distanceKm: 35.2,
      fuelLiters: 7.0,
      issuesCount: 2
    }
  },
  {
    id: '12',
    first_name: 'Самвел',
    last_name: 'Арутюнян',
    phone: '+374-91-234890',
    hub_id: 'hub-1',
    status: DriverStatus.DRIVING,
    region: 'Малатия-Себастия',
    district_id: '8',
    created_at: new Date().toISOString(),
    completed_stops: 11,
    total_stops: 14,
    total_km: 42.8,
    idle_minutes: 22,
    online_minutes: 200,
    issues_count: 0,
    last_gps: { lat: 40.1710, lon: 44.5200, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 11,
      totalStops: 14,
      idleTimeMinutes: 22,
      distanceKm: 42.8,
      fuelLiters: 8.6,
      issuesCount: 0
    }
  },
  {
    id: '13',
    first_name: 'Григор',
    last_name: 'Петросян',
    phone: '+374-91-345901',
    hub_id: 'hub-1',
    status: DriverStatus.ONLINE,
    region: 'Шенгавит',
    district_id: '9',
    created_at: new Date().toISOString(),
    completed_stops: 15,
    total_stops: 17,
    total_km: 52.1,
    idle_minutes: 25,
    online_minutes: 230,
    issues_count: 1,
    last_gps: { lat: 40.1740, lon: 44.5180, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 15,
      totalStops: 17,
      idleTimeMinutes: 25,
      distanceKm: 52.1,
      fuelLiters: 10.4,
      issuesCount: 1
    }
  },
  {
    id: '14',
    first_name: 'Ашот',
    last_name: 'Григорян',
    phone: '+374-91-456012',
    hub_id: 'hub-1',
    status: DriverStatus.IDLE,
    region: 'Нор-Норк',
    district_id: '10',
    created_at: new Date().toISOString(),
    completed_stops: 6,
    total_stops: 9,
    total_km: 29.5,
    idle_minutes: 80,
    online_minutes: 140,
    issues_count: 1,
    last_gps: { lat: 40.1780, lon: 44.5150, ts: new Date().toISOString() },
    todayStats: {
      deliveredStops: 6,
      totalStops: 9,
      idleTimeMinutes: 80,
      distanceKm: 29.5,
      fuelLiters: 5.9,
      issuesCount: 1
    }
  }
];

// Mock alerts data
export const mockAlerts: AlertWithDetails[] = [
  {
    id: 'alert-1',
    alert_type: AlertType.LONG_IDLE,
    severity: AlertSeverity.WARNING,
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
    alert_type: AlertType.ROUTE_DELAYED,
    severity: AlertSeverity.INFO,
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

// Mock districts data
export const mockDistricts = [
  {
    id: '1',
    name_ru: 'Кентрон',
    name_hy: 'Կենտրոն',
    area_km2: 6.1,
    population: 125000,
    center_lat: 40.1776,
    center_lon: 44.5126,
    description: 'Центральный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name_ru: 'Арабкир',
    name_hy: 'Արաբկիր',
    area_km2: 12.4,
    population: 150000,
    center_lat: 40.1820,
    center_lon: 44.5100,
    description: 'Северный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name_ru: 'Аван',
    name_hy: 'Ավան',
    area_km2: 8.2,
    population: 85000,
    center_lat: 40.1950,
    center_lon: 44.5200,
    description: 'Восточный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name_ru: 'Ачапняк',
    name_hy: 'Աջափնյակ',
    area_km2: 25.8,
    population: 110000,
    center_lat: 40.1900,
    center_lon: 44.4800,
    description: 'Западный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name_ru: 'Давидашен',
    name_hy: 'Դավիթաշեն',
    area_km2: 6.5,
    population: 42000,
    center_lat: 40.2100,
    center_lon: 44.4900,
    description: 'Северо-восточный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name_ru: 'Эребуни',
    name_hy: 'Էրեբունի',
    area_km2: 48.4,
    population: 125000,
    center_lat: 40.1400,
    center_lon: 44.5400,
    description: 'Юго-восточный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name_ru: 'Канакер-Зейтун',
    name_hy: 'Քանաքեռ-Զեյթուն',
    area_km2: 8.1,
    population: 73000,
    center_lat: 40.2200,
    center_lon: 44.5200,
    description: 'Северо-восточный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name_ru: 'Малатия-Себастия',
    name_hy: 'Մալաթիա-Սեբաստիա',
    area_km2: 25.8,
    population: 140000,
    center_lat: 40.1710,
    center_lon: 44.5200,
    description: 'Юго-западный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '9',
    name_ru: 'Шенгавит',
    name_hy: 'Շենգավիթ',
    area_km2: 9.1,
    population: 135000,
    center_lat: 40.1740,
    center_lon: 44.5180,
    description: 'Южный район Еревана',
    created_at: new Date().toISOString()
  },
  {
    id: '10',
    name_ru: 'Нор-Норк',
    name_hy: 'Նոր-Նորք',
    area_km2: 4.6,
    population: 125000,
    center_lat: 40.1790,
    center_lon: 44.5140,
    description: 'Центральный район Еревана',
    created_at: new Date().toISOString()
  }
];


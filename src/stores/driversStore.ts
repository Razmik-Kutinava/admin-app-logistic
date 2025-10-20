import { createSignal } from 'solid-js';
import type { DriverWithStats, DriverStatus } from '../types/driver';
import { mockDrivers } from './mockData';
import { supabase } from '../lib/supabase';

// ===== MOCK MODE - БЕЗ SUPABASE =====
const MOCK_MODE = true; // Временно включено для тестирования

// ===== Signals =====
const [drivers, setDrivers] = createSignal<DriverWithStats[]>(MOCK_MODE ? mockDrivers : []);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

// Filter signals
const [filterRegion, setFilterRegion] = createSignal<string | null>(null);
const [filterHub, setFilterHub] = createSignal<string | null>(null);
const [filterStatus, setFilterStatus] = createSignal<DriverStatus | null>(null);

// ===== Computed =====
export const filteredDrivers = () => {
  let result = drivers();
  
  if (filterRegion()) {
    result = result.filter(d => {
      // Filter by region
      return d.region === filterRegion();
    });
  }
  
  if (filterHub()) {
    result = result.filter(d => d.hub_id === filterHub());
  }
  
  if (filterStatus()) {
    result = result.filter(d => d.status === filterStatus());
  }
  
  return result;
};

export const driversOnline = () => {
  return drivers().filter(d => d.status === 'ONLINE' || d.status === 'DRIVING').length;
};

export const driversIdle = () => {
  return drivers().filter(d => d.status === 'IDLE').length;
};

// ===== Actions =====

/**
 * Fetch all drivers with their stats
 */
export async function fetchDrivers() {
  if (MOCK_MODE) {
    // Mock mode - возвращаем моковые данные
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Имитация задержки
    setDrivers(mockDrivers);
    setLoading(false);
    return;
  }
  
  // Real Supabase fetch
  try {
    setLoading(true);
    setError(null);
    
    const { data: driversData, error: driversError } = await supabase
      .from('drivers')
      .select('*')
      .order('last_name');
    
    if (driversError) throw driversError;
    
    // Загружаем районы отдельно
    const { data: districtsData } = await supabase
      .from('yerevan_districts')
      .select('*');
    
    // Создаем мапу районов
    const districtsMap = new Map();
    districtsData?.forEach(district => {
      districtsMap.set(district.id, district);
    });
    
    // Преобразуем данные из БД в DriverWithStats
    const driversWithStats: DriverWithStats[] = (driversData || []).map((driver) => ({
      // Основные поля Driver
      id: driver.id,
      first_name: driver.first_name,
      last_name: driver.last_name,
      phone: driver.phone,
      hub_id: driver.hub_id,
      status: driver.status as DriverStatus,
      region: driver.region,
      created_at: driver.created_at,
      
      // Поля DriverWithStats
      completed_stops: Math.floor(Math.random() * 15) + 5, // 5-20 адресов
      total_stops: Math.floor(Math.random() * 20) + 10, // 10-30 адресов
      total_km: Math.floor(Math.random() * 100) + 20, // 20-120 км
      idle_minutes: Math.floor(Math.random() * 60) + 15, // 15-75 минут
      online_minutes: Math.floor(Math.random() * 480) + 120, // 2-8 часов
      issues_count: Math.floor(Math.random() * 3), // 0-2 проблемы
      fuel_used: Math.floor(Math.random() * 50) + 10, // 10-60 литров
      
      // Дополнительные поля
      district: districtsMap.get(driver.district_id) || null,
      todayStats: {
        deliveredStops: Math.floor(Math.random() * 15) + 5, // 5-20 адресов
        totalStops: Math.floor(Math.random() * 20) + 10, // 10-30 адресов
        idleTimeMinutes: Math.floor(Math.random() * 60) + 15, // 15-75 минут
        distanceKm: Math.floor(Math.random() * 100) + 20, // 20-120 км
        fuelLiters: Math.floor(Math.random() * 50) + 10, // 10-60 литров
        issuesCount: Math.floor(Math.random() * 3) // 0-2 проблемы
      },
      lastSeen: driver.last_seen || new Date().toISOString()
    }));
    
    console.log('✅ Загружено водителей из Supabase:', driversWithStats.length);
    setDrivers(driversWithStats);
  } catch (err: any) {
    console.error('❌ Error fetching drivers:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

/**
 * Subscribe to driver updates via Realtime
 */
export function subscribeToDriverUpdates() {
  if (MOCK_MODE) {
    console.log('Mock mode: subscribeToDriverUpdates (no-op)');
    return;
  }
  // Real Supabase subscription (закомментировано)
}

/**
 * Unsubscribe from realtime updates
 */
export function unsubscribeFromDriverUpdates() {
  if (MOCK_MODE) {
    console.log('Mock mode: unsubscribeFromDriverUpdates (no-op)');
    return;
  }
  // Real Supabase unsubscribe (закомментировано)
}

/**
 * Get driver by ID
 */
export function getDriverById(id: string) {
  return drivers().find(d => d.id === id);
}

/**
 * Update driver status
 */
export async function updateDriverStatus(driverId: string, status: DriverStatus) {
  try {
    const { error: updateError } = await supabase
      .from('drivers')
      .update({ status })
      .eq('id', driverId);
    
    if (updateError) throw updateError;
    
    // Update local state
    setDrivers(prev => prev.map(d => 
      d.id === driverId ? { ...d, status } : d
    ));
    
    return { success: true };
  } catch (err: any) {
    console.error('Error updating driver status:', err);
    return { success: false, error: err.message };
  }
}

// ===== Exports =====
export const driversStore = {
  // State
  drivers,
  loading,
  error,
  
  // Filters
  filterRegion,
  setFilterRegion,
  filterHub,
  setFilterHub,
  filterStatus,
  setFilterStatus,
  
  // Computed
  filteredDrivers,
  driversOnline,
  driversIdle,
  
  // Actions
  fetchDrivers,
  subscribeToDriverUpdates,
  unsubscribeFromDriverUpdates,
  getDriverById,
  updateDriverStatus
};


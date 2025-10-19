import { createSignal } from 'solid-js';
import type { KPIMetrics, OperationsStats, PeriodData } from '../types/metrics';
import { UPDATE_INTERVALS } from '../utils/constants';
import { mockDrivers } from './mockData';
import { supabase } from '../lib/supabase';

// ===== MOCK MODE - БЕЗ SUPABASE =====
const MOCK_MODE = true; // Включаем для тестирования сравнения периодов

// ===== Signals =====
const [kpiMetrics, setKpiMetrics] = createSignal<KPIMetrics>({
  drivers_online: 0,
  drivers_online_trend: [],
  completed_addresses: 0,
  completed_addresses_trend: [],
  avg_idle_minutes: 0,
  idle_threshold: 60,
  idle_status: 'normal',
  total_km: 0,
  total_km_by_hour: Array(24).fill(0)
});

const [operationsStats, setOperationsStats] = createSignal<OperationsStats>({
  planned_by_hour: Array(24).fill(0),
  in_progress_by_hour: Array(24).fill(0),
  completed_by_hour: Array(24).fill(0),
  cancelled_by_hour: Array(24).fill(0),
  issue_by_hour: Array(24).fill(0),
  idle_heatmap: [],
  issues_by_type: []
});

const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

let updateInterval: number | null = null;

// ===== Actions =====

/**
 * Fetch KPI metrics for today
 */
export async function fetchKPIMetrics() {
  if (MOCK_MODE) {
    // Mock mode - вычисляем метрики из моковых данных
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const onlineCount = mockDrivers.filter(d => d.status === 'ONLINE' || d.status === 'DRIVING').length;
    const completedAddresses = mockDrivers.reduce((sum, d) => sum + d.completed_stops, 0);
    const totalKm = mockDrivers.reduce((sum, d) => sum + d.total_km, 0);
    const avgIdle = mockDrivers.reduce((sum, d) => sum + d.idle_minutes, 0) / mockDrivers.length;
    
    let idleStatus: 'normal' | 'warning' | 'critical' = 'normal';
    if (avgIdle > 90) idleStatus = 'critical';
    else if (avgIdle > 60) idleStatus = 'warning';
    
    setKpiMetrics({
      drivers_online: onlineCount,
      drivers_online_trend: [5, 6, 7, 8, 7, 6, 7, 8],
      completed_addresses: completedAddresses,
      completed_addresses_trend: [10, 15, 20, 30, 45, 60, 80, 110],
      avg_idle_minutes: Math.round(avgIdle),
      idle_threshold: 60,
      idle_status: idleStatus,
      total_km: totalKm,
      total_km_by_hour: Array(24).fill(0).map((_, i) => i * 15 + Math.random() * 10)
    });
    
    setLoading(false);
    return;
  }
  
  // Real Supabase fetch
  try {
    setLoading(true);
    setError(null);
    
    // Получаем водителей онлайн
    const { data: driversData, error: driversError } = await supabase
      .from('drivers')
      .select('status');
    
    if (driversError) throw driversError;
    
    const onlineCount = (driversData || []).filter(
      d => d.status === 'ONLINE' || d.status === 'DRIVING'
    ).length;
    
    // TODO: Получить реальные данные из routes/stops для остальных метрик
    // Пока используем базовые значения
    setKpiMetrics({
      drivers_online: onlineCount,
      drivers_online_trend: [onlineCount - 2, onlineCount - 1, onlineCount],
      completed_addresses: 0, // TODO: подсчитать из stops
      completed_addresses_trend: [],
      avg_idle_minutes: 0, // TODO: подсчитать из gps_tracks
      idle_threshold: 60,
      idle_status: 'normal',
      total_km: 0, // TODO: подсчитать из routes
      total_km_by_hour: Array(24).fill(0)
    });
    
    console.log('✅ KPI метрики загружены из Supabase');
  } catch (err: any) {
    console.error('❌ Error fetching KPI metrics:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

/**
 * Fetch operations statistics
 */
export async function fetchOperationsStats() {
  if (MOCK_MODE) {
    // Mock mode - генерируем моковые данные
    setOperationsStats({
      planned_by_hour: Array(24).fill(0).map(() => Math.floor(Math.random() * 5)),
      in_progress_by_hour: Array(24).fill(0).map(() => Math.floor(Math.random() * 3)),
      completed_by_hour: Array(24).fill(0).map((_, i) => i < 18 ? Math.floor(Math.random() * 10) : 0),
      cancelled_by_hour: Array(24).fill(0).map(() => Math.floor(Math.random() * 2)),
      issue_by_hour: Array(24).fill(0).map(() => Math.floor(Math.random() * 2)),
      idle_heatmap: [],
      issues_by_type: [
        { type: 'TRAFFIC', count: 8, percentage: 60, cumulative_percentage: 60 },
        { type: 'NO_SHOW', count: 3, percentage: 22.5, cumulative_percentage: 82.5 },
        { type: 'BAD_ADDRESS', count: 2, percentage: 15, cumulative_percentage: 97.5 },
        { type: 'OTHER', count: 1, percentage: 2.5, cumulative_percentage: 100 }
      ]
    });
    return;
  }
  
  // Real Supabase fetch
  try {
    // TODO: Получить реальные данные из stops/routes/issues
    // Пока используем базовые пустые значения
    setOperationsStats({
      planned_by_hour: Array(24).fill(0),
      in_progress_by_hour: Array(24).fill(0),
      completed_by_hour: Array(24).fill(0),
      cancelled_by_hour: Array(24).fill(0),
      issue_by_hour: Array(24).fill(0),
      idle_heatmap: [],
      issues_by_type: []
    });
    
    console.log('✅ Operations stats загружены');
  } catch (err: any) {
    console.error('❌ Error fetching operations stats:', err);
  }
}

/**
 * Start auto-updating metrics
 */
export function startMetricsUpdate() {
  if (updateInterval) {
    return; // Already running
  }
  
  // Initial fetch
  fetchKPIMetrics();
  fetchOperationsStats();
  
  // Set up interval
  updateInterval = window.setInterval(() => {
    fetchKPIMetrics();
    fetchOperationsStats();
  }, UPDATE_INTERVALS.KPI_METRICS);
}

/**
 * Stop auto-updating
 */
export function stopMetricsUpdate() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

/**
 * Fetch period data for comparison (today vs yesterday)
 */
export async function fetchPeriodData(date: Date): Promise<PeriodData> {
  if (MOCK_MODE) {
    // Mock mode - генерируем данные для разных дней
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    // Базовые значения для "сегодня"
    const baseDrivers = 8;
    const baseAddresses = 45;
    const baseIdle = 35;
    const baseKm = 120;
    
    // Генерируем стабильные данные на основе даты
    const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 365;
    const random = (multiplier: number) => {
      const x = Math.sin(seed * multiplier) * 0.5 + 0.5;
      return x;
    };
    
    let multiplier = 1;
    if (isToday) {
      multiplier = 1.0; // Сегодня - базовые значения
    } else if (isYesterday) {
      multiplier = 0.85; // Вчера - немного меньше
    } else {
      // Для других дней - стабильные вариации на основе даты
      multiplier = 0.7 + random(1) * 0.6; // 0.7 - 1.3
    }
    
    // Добавляем небольшие случайные колебания
    const variation = 0.9 + random(2) * 0.2; // ±10% вариация
    
    return {
      period: date.toLocaleDateString('ru-RU'),
      drivers_online: Math.round(baseDrivers * multiplier * variation),
      completed_addresses: Math.round(baseAddresses * multiplier * variation),
      avg_idle_minutes: Math.round(baseIdle * (0.8 + random(3) * 0.4) * variation), // 0.8-1.2
      total_km: Math.round(baseKm * multiplier * variation)
    };
  }
  
  // Real Supabase fetch
  try {
    // TODO: Получить реальные данные из БД для указанной даты
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Пока возвращаем базовые значения
    return {
      period: date.toLocaleDateString('ru-RU'),
      drivers_online: 0,
      completed_addresses: 0,
      avg_idle_minutes: 0,
      total_km: 0
    };
  } catch (err: any) {
    console.error('❌ Error fetching period data:', err);
    return {
      period: date.toLocaleDateString('ru-RU'),
      drivers_online: 0,
      completed_addresses: 0,
      avg_idle_minutes: 0,
      total_km: 0
    };
  }
}

// ===== Exports =====
export const metricsStore = {
  // State
  kpiMetrics,
  operationsStats,
  loading,
  error,
  
  // Actions
  fetchKPIMetrics,
  fetchOperationsStats,
  fetchPeriodData,
  startMetricsUpdate,
  stopMetricsUpdate
};


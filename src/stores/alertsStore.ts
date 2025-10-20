import { createSignal } from 'solid-js';
import type { AlertWithDetails, AlertType, AlertSeverity } from '../types/alert';
import { mockAlerts } from './mockData';
import { supabase } from '../lib/supabase';

// ===== MOCK MODE - БЕЗ SUPABASE =====
const MOCK_MODE = true; // Временно включено для тестирования

// ===== Signals =====
const [alerts, setAlerts] = createSignal<AlertWithDetails[]>(MOCK_MODE ? mockAlerts : []);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

// ===== Computed =====
export const unacknowledgedAlerts = () => {
  return alerts().filter(a => !a.acknowledged);
};

export const criticalAlerts = () => {
  return alerts().filter(a => a.severity === 'CRITICAL' && !a.acknowledged);
};

export const alertsByType = (type: AlertType) => {
  return alerts().filter(a => a.alert_type === type && !a.acknowledged);
};

// ===== Actions =====

/**
 * Fetch all unacknowledged alerts
 */
export async function fetchAlerts() {
  if (MOCK_MODE) {
    // Mock mode - возвращаем моковые алёрты
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setAlerts(mockAlerts);
    setLoading(false);
    return;
  }
  
  // Real Supabase fetch
  try {
    setLoading(true);
    setError(null);
    
    const { data: alertsData, error: alertsError } = await supabase
      .from('logistic_alerts')
      .select('*')
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    
    if (alertsError) throw alertsError;
    
    // Преобразуем данные в AlertWithDetails
    const alertsWithDetails: AlertWithDetails[] = (alertsData || []).map((alert) => ({
      id: alert.id,
      alert_type: alert.type as AlertType,
      severity: alert.severity as AlertSeverity,
      title: alert.title || alert.message,
      message: alert.message,
      entity_type: alert.type,
      entity_id: alert.driver_id || alert.route_id,
      acknowledged: alert.is_read,
      acknowledged_by: undefined,
      acknowledged_at: undefined,
      created_at: alert.created_at,
      metadata: alert.metadata,
      // Details (пока без join)
      entityName: undefined,
      driverName: undefined
    }));
    
    console.log('✅ Загружено алертов из Supabase:', alertsWithDetails.length);
    setAlerts(alertsWithDetails);
  } catch (err: any) {
    console.error('❌ Error fetching alerts:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

/**
 * Create a new alert
 */
export async function createAlert(
  alertType: AlertType,
  severity: AlertSeverity,
  message: string,
  driverId?: string,
  vehicleId?: string
) {
  try {
    const { data, error: createError } = await supabase
      .from('alerts')
      .insert({
        alert_type: alertType,
        severity,
        message,
        driver_id: driverId,
        vehicle_id: vehicleId,
        acknowledged: false
      })
      .select()
      .single();
    
    if (createError) throw createError;
    
    return { success: true, alert: data };
  } catch (err: any) {
    console.error('Error creating alert:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string) {
  if (MOCK_MODE) {
    // Mock mode - просто убираем из списка
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    return { success: true };
  }
  
  // Real Supabase update (закомментировано)
  /*
  try {
    const { error: updateError } = await supabase.from('alerts').update({ acknowledged: true }).eq('id', alertId);
    if (updateError) throw updateError;
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    return { success: true };
  } catch (err: any) {
    console.error('Error acknowledging alert:', err);
    return { success: false, error: err.message };
  }
  */
  return { success: true };
}

/**
 * Acknowledge all alerts
 */
export async function acknowledgeAllAlerts() {
  try {
    const alertIds = alerts().map(a => a.id);
    
    const { error: updateError } = await supabase
      .from('alerts')
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString()
      })
      .in('id', alertIds);
    
    if (updateError) throw updateError;
    
    // Clear local state
    setAlerts([]);
    
    return { success: true };
  } catch (err: any) {
    console.error('Error acknowledging all alerts:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Subscribe to new alerts via Realtime
 */
export function subscribeToAlertUpdates() {
  if (MOCK_MODE) {
    console.log('Mock mode: subscribeToAlertUpdates (no-op)');
    return;
  }
  // Real Supabase subscription (закомментировано)
}

/**
 * Unsubscribe from updates
 */
export function unsubscribeFromAlertUpdates() {
  if (MOCK_MODE) {
    console.log('Mock mode: unsubscribeFromAlertUpdates (no-op)');
    return;
  }
  // Real Supabase unsubscribe (закомментировано)
}

// ===== Exports =====
export const alertsStore = {
  // State
  alerts,
  loading,
  error,
  
  // Computed
  unacknowledgedAlerts,
  criticalAlerts,
  alertsByType,
  
  // Actions
  fetchAlerts,
  createAlert,
  acknowledgeAlert,
  acknowledgeAllAlerts,
  subscribeToAlertUpdates,
  unsubscribeFromAlertUpdates
};


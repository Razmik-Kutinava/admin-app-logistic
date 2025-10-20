import { createSignal } from 'solid-js';
import { supabase } from '../lib/supabase';
import type { RouteWithDetails, RouteStatus } from '../types/route';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ===== Signals =====
const [routes, setRoutes] = createSignal<RouteWithDetails[]>([]);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

// Filter signals
const [filterDate, setFilterDate] = createSignal<string | null>(null);
const [filterDriver, setFilterDriver] = createSignal<string | null>(null);
const [filterStatus, setFilterStatus] = createSignal<RouteStatus | null>(null);

let realtimeChannel: RealtimeChannel | null = null;

// ===== Computed =====
export const filteredRoutes = () => {
  let result = routes();
  
  if (filterDate()) {
    result = result.filter(r => r.date === filterDate());
  }
  
  if (filterDriver()) {
    result = result.filter(r => r.driver_id === filterDriver());
  }
  
  if (filterStatus()) {
    result = result.filter(r => r.status === filterStatus());
  }
  
  return result;
};

export const todayRoutes = () => {
  const today = new Date().toISOString().split('T')[0];
  return routes().filter(r => r.date === today);
};

export const activeRoutes = () => {
  return routes().filter(r => r.status === 'IN_PROGRESS');
};

// ===== Actions =====

/**
 * Fetch routes with details
 */
export async function fetchRoutes(date?: string) {
  try {
    setLoading(true);
    setError(null);
    
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Fetch routes with stops
    const { data: routesData, error: routesError } = await supabase
      .from('routes')
      .select(`
        *,
        driver:drivers(*),
        vehicle:vehicles(*),
        stops(*)
      `)
      .eq('date', targetDate)
      .order('created_at', { ascending: false });
    
    if (routesError) throw routesError;
    
    // For each route, count issues
    const routesWithDetails: RouteWithDetails[] = await Promise.all(
      (routesData || []).map(async (route) => {
        const { data: issues } = await supabase
          .from('issues')
          .select('id')
          .in('stop_id', route.stops?.map((s: any) => s.id) || []);
        
        return {
          ...route,
          issues_count: issues?.length || 0
        };
      })
    );
    
    setRoutes(routesWithDetails);
  } catch (err: any) {
    console.error('Error fetching routes:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

/**
 * Get route by ID with full details
 */
export async function fetchRouteById(id: string) {
  try {
    const { data, error: routeError } = await supabase
      .from('routes')
      .select(`
        *,
        driver:drivers(*),
        vehicle:vehicles(*),
        stops(*)
      `)
      .eq('id', id)
      .single();
    
    if (routeError) throw routeError;
    
    // Fetch issues for this route's stops
    const { data: issues } = await supabase
      .from('issues')
      .select('*')
      .in('stop_id', data.stops?.map((s: any) => s.id) || []);
    
    return {
      ...data,
      issues_count: issues?.length || 0
    };
  } catch (err: any) {
    console.error('Error fetching route:', err);
    return null;
  }
}

/**
 * Subscribe to route updates
 */
export function subscribeToRouteUpdates() {
  if (realtimeChannel) {
    return;
  }
  
  realtimeChannel = supabase
    .channel('routes-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'routes'
      },
      (payload) => {
        console.log('Route update:', payload);
        fetchRoutes();
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'stops'
      },
      (payload) => {
        console.log('Stop update:', payload);
        fetchRoutes();
      }
    )
    .subscribe();
}

/**
 * Unsubscribe from updates
 */
export function unsubscribeFromRouteUpdates() {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}

/**
 * Update route status
 */
export async function updateRouteStatus(routeId: string, status: RouteStatus) {
  try {
    const { error: updateError } = await supabase
      .from('routes')
      .update({ status })
      .eq('id', routeId);
    
    if (updateError) throw updateError;
    
    // Update local state
    setRoutes(prev => prev.map(r => 
      r.id === routeId ? { ...r, status } : r
    ));
    
    return { success: true };
  } catch (err: any) {
    console.error('Error updating route status:', err);
    return { success: false, error: err.message };
  }
}

// ===== Exports =====
export const routesStore = {
  // State
  routes,
  loading,
  error,
  
  // Filters
  filterDate,
  setFilterDate,
  filterDriver,
  setFilterDriver,
  filterStatus,
  setFilterStatus,
  
  // Computed
  filteredRoutes,
  todayRoutes,
  activeRoutes,
  
  // Actions
  fetchRoutes,
  fetchRouteById,
  subscribeToRouteUpdates,
  unsubscribeFromRouteUpdates,
  updateRouteStatus
};



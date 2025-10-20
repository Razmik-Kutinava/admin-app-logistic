import { createSignal } from 'solid-js';
import type { YerevanDistrict, YerevanStreet } from '../types/district';
import { supabase } from '../lib/supabase';
import { mockDistricts } from './mockData';

// ===== MOCK MODE =====
const MOCK_MODE = true; // Временно включено для тестирования

// ===== Signals =====
const [districts, setDistricts] = createSignal<YerevanDistrict[]>(MOCK_MODE ? mockDistricts : []);
const [streets] = createSignal<YerevanStreet[]>([]);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

// ===== Actions =====

/**
 * Fetch all Yerevan districts
 */
export const fetchDistricts = async () => {
  if (MOCK_MODE) {
    // Mock data will be loaded from mockData.ts
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const { data, error: districtsError } = await supabase
      .from('yerevan_districts')
      .select('*')
      .order('name_ru');

    if (districtsError) throw districtsError;

    setDistricts(data || []);
    console.log('✅ Загружено районов Еревана:', data?.length || 0);
  } catch (err) {
    console.error('❌ Error fetching districts:', err);
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setLoading(false);
  }
};

/**
 * Fetch streets for a specific district
 */
export const fetchStreetsByDistrict = async (districtId: string) => {
  if (MOCK_MODE) {
    return;
  }

  try {
    const { data, error: streetsError } = await supabase
      .from('yerevan_streets')
      .select('*')
      .eq('district_id', districtId)
      .order('is_main', { ascending: false })
      .order('name_ru');

    if (streetsError) throw streetsError;

    return data || [];
  } catch (err) {
    console.error('❌ Error fetching streets:', err);
    return [];
  }
};

/**
 * Get district by ID
 */
export const getDistrictById = (districtId: string): YerevanDistrict | undefined => {
  return districts().find(d => d.id === districtId);
};

/**
 * Get district by name
 */
export const getDistrictByName = (name: string): YerevanDistrict | undefined => {
  return districts().find(d => d.name_ru === name);
};

/**
 * Get streets for a district
 */
export const getStreetsByDistrict = (districtId: string): YerevanStreet[] => {
  return streets().filter(s => s.district_id === districtId);
};

// ===== Exports =====
export const districtsStore = {
  districts,
  streets,
  loading,
  error,
  fetchDistricts,
  fetchStreetsByDistrict,
  getDistrictById,
  getDistrictByName,
  getStreetsByDistrict
};

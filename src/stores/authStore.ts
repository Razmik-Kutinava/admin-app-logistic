import { createSignal } from 'solid-js';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ===== MOCK MODE - БЕЗ SUPABASE =====
const MOCK_MODE = true;

// ===== Signals =====
const [user, setUser] = createSignal<User | null>(null);
const [session, setSession] = createSignal<Session | null>(null);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<string | null>(null);

// ===== Computed =====
export const isAuthenticated = () => {
  if (MOCK_MODE) return true; // В mock режиме всегда авторизован
  return !!user();
};

// ===== Initialize Auth State =====
const initializeAuth = async () => {
  if (MOCK_MODE) {
    // Mock mode - имитируем пользователя
    setLoading(false);
    setUser({
      id: 'mock-user',
      email: 'admin@logistic.am',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User);
    return;
  }
  
  // Real Supabase auth
  try {
    setLoading(true);
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
  } catch (err: any) {
    console.error('Error initializing auth:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// ===== Actions =====

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  if (MOCK_MODE) {
    // Mock mode - всегда успешный вход
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
    setUser({
      id: 'mock-user',
      email: email,
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User);
    setLoading(false);
    return { success: true };
  }
  
  // Real Supabase auth
  try {
    setLoading(true);
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
    setSession(data.session);
    setUser(data.user);
    return { success: true };
  } catch (err: any) {
    console.error('Sign in error:', err);
    setError(err.message);
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    setLoading(true);
    setError(null);
    
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) throw signOutError;
    
    setSession(null);
    setUser(null);
    
    return { success: true };
  } catch (err: any) {
    console.error('Sign out error:', err);
    setError(err.message);
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
}

/**
 * Sign up new user
 */
export async function signUp(email: string, password: string, metadata?: Record<string, any>) {
  try {
    setLoading(true);
    setError(null);
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (signUpError) throw signUpError;
    
    return { success: true, user: data.user };
  } catch (err: any) {
    console.error('Sign up error:', err);
    setError(err.message);
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
}

// Initialize auth on module load
initializeAuth();

// ===== Exports =====
export const authStore = {
  // State
  user,
  session,
  loading,
  error,
  
  // Computed
  isAuthenticated,
  
  // Actions
  signIn,
  signOut,
  signUp,
  initialize: initializeAuth
};


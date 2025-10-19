import { createClient } from '@supabase/supabase-js';

// Debug: проверяем что загружается
console.log('🔍 ENV DEBUG:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ EXISTS' : '❌ MISSING',
  allEnv: import.meta.env
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fhfrjaxujwgcsdtrvmtq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZnJqYXh1andnY3NkdHJ2bXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTc0OTcsImV4cCI6MjA3NjMzMzQ5N30.J0pmmx3RvGqDbczb0zZdH_GKfG2jzTM1ayRfHMAXz1c';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types will be added here once schema is created
export type Database = {};


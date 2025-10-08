import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Use dummy values for build if not configured
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Warn once if using placeholder values
let hasWarned = false;
if (typeof window !== 'undefined' && SUPABASE_URL.includes('placeholder') && !hasWarned) {
  console.info('🎭 Modo Demo: Usando localStorage para auth (Supabase no configurado)');
  hasWarned = true;
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

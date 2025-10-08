import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * User Types
 */

export interface UserPreferences {
  id: string;
  user_id: string;
  favorite_dolares: string[];
  favorite_currencies: string[];
  dashboard_layout: Record<string, any> | null;
  theme: 'dark' | 'light' | 'high-contrast';
  notifications_enabled: boolean;
  email_alerts: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavedCalculation {
  id: string;
  user_id: string;
  type: string;
  inputs: Record<string, any>;
  result: Record<string, any>;
  name: string | null;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  type: 'dolar' | 'cotizacion' | 'inflacion';
  target_name: string;
  threshold: number;
  condition: 'above' | 'below' | 'change';
  notification_type: 'email' | 'dashboard' | 'both';
  is_active: boolean;
  last_triggered: string | null;
  created_at: string;
}

export interface UserProfile {
  user: SupabaseUser;
  preferences: UserPreferences | null;
}

export type { User as SupabaseUser } from '@supabase/supabase-js';

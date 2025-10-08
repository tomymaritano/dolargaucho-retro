/**
 * Database Types for Supabase
 * Auto-generated types for database schema
 */

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          favorite_dolares?: string[];
          favorite_currencies?: string[];
          dashboard_layout?: Record<string, any> | null;
          theme?: 'dark' | 'light' | 'high-contrast';
          notifications_enabled?: boolean;
          email_alerts?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          favorite_dolares?: string[];
          favorite_currencies?: string[];
          dashboard_layout?: Record<string, any> | null;
          theme?: 'dark' | 'light' | 'high-contrast';
          notifications_enabled?: boolean;
          email_alerts?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_calculations: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          inputs: Record<string, any>;
          result: Record<string, any>;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          inputs: Record<string, any>;
          result: Record<string, any>;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          inputs?: Record<string, any>;
          result?: Record<string, any>;
          name?: string | null;
          created_at?: string;
        };
      };
      price_alerts: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'dolar' | 'cotizacion' | 'inflacion';
          target_name: string;
          threshold: number;
          condition: 'above' | 'below' | 'change';
          notification_type?: 'email' | 'dashboard' | 'both';
          is_active?: boolean;
          last_triggered?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'dolar' | 'cotizacion' | 'inflacion';
          target_name?: string;
          threshold?: number;
          condition?: 'above' | 'below' | 'change';
          notification_type?: 'email' | 'dashboard' | 'both';
          is_active?: boolean;
          last_triggered?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

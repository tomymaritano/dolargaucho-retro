/**
 * Lead Types
 * Types for lead generation and subscription system
 */

export interface Lead {
  id: string;
  email: string;
  name?: string;
  source: 'homepage' | 'register' | 'newsletter' | 'cta' | 'other';
  status: 'pending' | 'confirmed' | 'unsubscribed';
  subscribed_to_newsletter: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadInput {
  email: string;
  name?: string;
  source?: Lead['source'];
  subscribed_to_newsletter?: boolean;
  metadata?: Record<string, any>;
}

export interface LeadStats {
  total: number;
  confirmed: number;
  pending: number;
  unsubscribed: number;
  bySource: Record<Lead['source'], number>;
  recentLeads: Lead[];
}

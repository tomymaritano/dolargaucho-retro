import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { CreateLeadInput, Lead } from '@/types/leads';
import { isValidEmail } from '@/lib/auth/helpers';

type ResponseData = { success: true; lead: Lead } | { success: false; error: string };

/**
 * POST /api/leads - Create a new lead
 * Captures email subscriptions and lead generation
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      email,
      name,
      source = 'other',
      subscribed_to_newsletter = true,
      metadata,
    }: CreateLeadInput = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email es requerido' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Email inválido' });
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isSupabaseConfigured =
      supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes('placeholder') &&
      !supabaseKey.includes('placeholder');

    // If Supabase is not configured, store in memory/localStorage (demo mode)
    if (!isSupabaseConfigured) {
      const demoLead: Lead = {
        id: `demo-${Date.now()}`,
        email,
        name,
        source,
        status: 'confirmed',
        subscribed_to_newsletter,
        metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('[Demo Mode] Lead captured:', demoLead);

      return res.status(200).json({
        success: true,
        lead: demoLead,
      });
    }

    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .single();

    // If exists and is unsubscribed, re-subscribe
    if (existingLead && (existingLead as any).status === 'unsubscribed') {
      // @ts-ignore - Supabase types are not properly inferred without generated types
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        // @ts-ignore
        .update({
          status: 'pending',
          subscribed_to_newsletter,
          source,
          name: name || (existingLead as any).name,
          metadata: { ...(existingLead as any).metadata, ...metadata },
          updated_at: new Date().toISOString(),
        })
        .eq('email', email)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating lead:', updateError);
        return res.status(500).json({ success: false, error: 'Error al actualizar suscripción' });
      }

      return res.status(200).json({
        success: true,
        lead: updatedLead as Lead,
      });
    }

    // If already exists and is active, return existing
    if (existingLead && (existingLead as any).status !== 'unsubscribed') {
      return res.status(200).json({
        success: true,
        lead: existingLead as Lead,
      });
    }

    // Create new lead
    // @ts-ignore - Supabase types are not properly inferred without generated types
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      // @ts-ignore
      .insert([
        {
          email,
          name,
          source,
          status: 'pending',
          subscribed_to_newsletter,
          metadata,
        },
      ])
      .select()
      .single();

    if (insertError) {
      // If table doesn't exist, log and return success in demo mode
      if (insertError.code === '42P01') {
        console.warn('leads table does not exist - using demo mode');
        const demoLead: Lead = {
          id: `demo-${Date.now()}`,
          email,
          name,
          source,
          status: 'confirmed',
          subscribed_to_newsletter,
          metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return res.status(200).json({
          success: true,
          lead: demoLead,
        });
      }

      console.error('Error creating lead:', insertError);
      return res.status(500).json({ success: false, error: 'Error al guardar suscripción' });
    }

    // TODO: Send welcome email or confirmation email
    // You can integrate with EmailJS or another email service here

    return res.status(201).json({
      success: true,
      lead: newLead as Lead,
    });
  } catch (error) {
    console.error('Unexpected error in leads API:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
}

/**
 * Cron Job: Check Alerts
 *
 * GET /api/cron/check-alerts
 * Verifies all active alerts and sends email notifications when triggered
 *
 * This endpoint should be called periodically by Vercel Cron Jobs
 * Recommended: Every 5 minutes
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAllAlerts } from '@/lib/alerts/check-alerts';

interface SuccessResponse {
  success: true;
  message: string;
  stats: {
    usersChecked: number;
    alertsChecked: number;
    alertsTriggered: number;
  };
  timestamp: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type CheckAlertsResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckAlertsResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  // Verify authorization (Vercel Cron Secret)
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.error('[Cron] Unauthorized access attempt to check-alerts');
    return res.status(401).json({
      success: false,
      error: 'No autorizado',
    });
  }

  try {
    console.log('[Cron] Starting alert check job...');

    // Check all alerts
    const result = await checkAllAlerts();

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: 'Error al verificar alertas',
      });
    }

    // Return success with stats
    return res.status(200).json({
      success: true,
      message: 'Alerts checked successfully',
      stats: {
        usersChecked: result.usersChecked,
        alertsChecked: result.alertsChecked,
        alertsTriggered: result.alertsTriggered,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Error in check-alerts job:', error);

    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
}

/**
 * Alert Verification Service
 *
 * Checks all active user alerts and triggers email notifications
 */

import { getUserAlerts, updateUserAlert, getUsersWithActiveAlerts } from '@/lib/db/queries';
import { sendAlertTriggeredEmail } from '@/lib/email';
import type { UserAlert } from '@/lib/db/queries';

/**
 * Fetch current value for an alert
 */
async function getCurrentValue(alert: UserAlert): Promise<number | null> {
  try {
    switch (alert.tipo) {
      case 'dolar': {
        const casaDolar = alert.metadata?.casaDolar;
        if (!casaDolar) return null;

        // Fetch from DolarAPI
        const response = await fetch(`https://dolarapi.com/v1/dolares/${casaDolar}`);
        if (!response.ok) return null;

        const data = await response.json();
        return data.venta || null;
      }

      case 'inflacion': {
        // Fetch latest inflation from ArgentinaData
        const response = await fetch(
          'https://api.argentinadatos.com/v1/finanzas/indices/inflacion'
        );
        if (!response.ok) return null;

        const data = await response.json();
        return data[0]?.valor || null;
      }

      case 'riesgo-pais': {
        // Fetch latest riesgo pais from ArgentinaData
        const response = await fetch(
          'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo'
        );
        if (!response.ok) return null;

        const data = await response.json();
        return data.valor || null;
      }

      case 'uva': {
        // Fetch latest UVA from ArgentinaData
        const response = await fetch(
          'https://api.argentinadatos.com/v1/finanzas/indices/uva/ultimo'
        );
        if (!response.ok) return null;

        const data = await response.json();
        return data.valor || null;
      }

      case 'tasa': {
        // Fetch latest tasa plazo fijo from ArgentinaData
        const response = await fetch('https://api.argentinadatos.com/v1/finanzas/tasas/plazo-fijo');
        if (!response.ok) return null;

        const data = await response.json();
        return data[0]?.tnaClientes ? data[0].tnaClientes * 100 : null;
      }

      default:
        return null;
    }
  } catch (error) {
    console.error(`[Alerts] Error fetching value for ${alert.tipo}:`, error);
    return null;
  }
}

/**
 * Check if alert condition is met
 */
function isConditionMet(currentValue: number, targetValue: number, condition: string): boolean {
  switch (condition) {
    case 'mayor':
      return currentValue > targetValue;
    case 'menor':
      return currentValue < targetValue;
    case 'igual':
      return Math.abs(currentValue - targetValue) < 0.01;
    default:
      return false;
  }
}

/**
 * Check a single alert
 */
async function checkAlert(alert: UserAlert, userEmail: string, userName?: string): Promise<void> {
  try {
    // Get current value
    const currentValue = await getCurrentValue(alert);

    if (currentValue === null) {
      console.warn(`[Alerts] Could not fetch value for alert ${alert.id}`);
      return;
    }

    // Update last verification time
    await updateUserAlert(alert.id, alert.user_id, {
      fechaUltimaVerificacion: new Date().toISOString(),
    });

    // Check if condition is met
    const triggered = isConditionMet(currentValue, Number(alert.valor_objetivo), alert.condicion);

    if (triggered && alert.estado === 'activa') {
      console.log(`[Alerts] Alert ${alert.id} triggered! Sending email...`);

      // Update alert state to 'disparada'
      await updateUserAlert(alert.id, alert.user_id, {
        estado: 'disparada',
        fechaDisparada: new Date().toISOString(),
        notificacionEnviada: true,
      });

      // Send email notification (only if RESEND_API_KEY is configured)
      if (process.env.RESEND_API_KEY) {
        try {
          await sendAlertTriggeredEmail({
            to: userEmail,
            name: userName,
            alertName: alert.nombre,
            alertType: alert.tipo as any,
            condition: alert.condicion as any,
            targetValue: Number(alert.valor_objetivo),
            currentValue,
            message: alert.mensaje || undefined,
          });
          console.log(`[Alerts] Email sent for alert ${alert.id}`);
        } catch (emailError) {
          console.error(`[Alerts] Failed to send email for alert ${alert.id}:`, emailError);
          // Don't throw - alert was still triggered successfully
        }
      } else {
        console.warn('[Alerts] Email service not configured - notification not sent');
      }
    }
  } catch (error) {
    console.error(`[Alerts] Error checking alert ${alert.id}:`, error);
  }
}

/**
 * Check all active alerts for a user
 */
async function checkUserAlerts(userId: string, userEmail: string, userName?: string) {
  try {
    // Get all user alerts
    const alerts = await getUserAlerts(userId);

    // Filter only active alerts
    const activeAlerts = alerts.filter((a) => a.estado === 'activa');

    console.log(`[Alerts] Checking ${activeAlerts.length} active alerts for user ${userId}`);

    // Check each alert
    await Promise.allSettled(activeAlerts.map((alert) => checkAlert(alert, userEmail, userName)));
  } catch (error) {
    console.error(`[Alerts] Error checking alerts for user ${userId}:`, error);
  }
}

/**
 * Check all alerts for all users
 * This is called by the cron job
 */
export async function checkAllAlerts(): Promise<{
  success: boolean;
  usersChecked: number;
  alertsChecked: number;
  alertsTriggered: number;
}> {
  console.log('[Alerts] Starting alert verification...');

  try {
    // Get all users with active alerts
    const users = await getUsersWithActiveAlerts();
    console.log(`[Alerts] Found ${users.length} users with active alerts`);

    let totalAlertsChecked = 0;
    let totalAlertsTriggered = 0;

    // Check alerts for each user
    for (const user of users) {
      const alerts = await getUserAlerts(user.user_id);
      const activeAlerts = alerts.filter((a) => a.estado === 'activa');

      totalAlertsChecked += activeAlerts.length;

      // Count triggered alerts (before checking)
      const beforeTriggered = alerts.filter((a) => a.estado === 'disparada').length;

      // Check alerts
      await checkUserAlerts(user.user_id, user.email, user.name || undefined);

      // Count triggered alerts (after checking)
      const updatedAlerts = await getUserAlerts(user.user_id);
      const afterTriggered = updatedAlerts.filter((a) => a.estado === 'disparada').length;

      totalAlertsTriggered += afterTriggered - beforeTriggered;
    }

    console.log('[Alerts] Alert verification complete');
    console.log(`[Alerts] Users checked: ${users.length}`);
    console.log(`[Alerts] Alerts checked: ${totalAlertsChecked}`);
    console.log(`[Alerts] Alerts triggered: ${totalAlertsTriggered}`);

    return {
      success: true,
      usersChecked: users.length,
      alertsChecked: totalAlertsChecked,
      alertsTriggered: totalAlertsTriggered,
    };
  } catch (error) {
    console.error('[Alerts] Error checking all alerts:', error);
    return {
      success: false,
      usersChecked: 0,
      alertsChecked: 0,
      alertsTriggered: 0,
    };
  }
}

export { checkUserAlerts, checkAlert };

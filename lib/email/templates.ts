/**
 * Email Template Helpers
 *
 * Convenience functions to send emails using React Email templates
 */

import { sendEmail } from './resend';
import WelcomeEmail from '@/emails/WelcomeEmail';
import PasswordResetEmail from '@/emails/PasswordResetEmail';
import AlertTriggeredEmail from '@/emails/AlertTriggeredEmail';

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail({ to, name }: { to: string; name?: string }) {
  return sendEmail({
    to,
    subject: '¡Bienvenido a Dólar Gaucho! 🎉',
    react: WelcomeEmail({ email: to, name }),
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({
  to,
  name,
  resetToken,
}: {
  to: string;
  name?: string;
  resetToken: string;
}) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  return sendEmail({
    to,
    subject: 'Restablecer contraseña - Dólar Gaucho',
    react: PasswordResetEmail({
      email: to,
      name,
      resetLink,
    }),
  });
}

/**
 * Send alert triggered email
 */
export async function sendAlertTriggeredEmail({
  to,
  name,
  alertName,
  alertType,
  condition,
  targetValue,
  currentValue,
  message,
}: {
  to: string;
  name?: string;
  alertName: string;
  alertType: 'dolar' | 'inflacion' | 'riesgo-pais' | 'uva' | 'tasa';
  condition: 'mayor' | 'menor' | 'igual';
  targetValue: number;
  currentValue: number;
  message?: string;
}) {
  return sendEmail({
    to,
    subject: `🔔 Alerta disparada: ${alertName}`,
    react: AlertTriggeredEmail({
      email: to,
      name,
      alertName,
      alertType,
      condition,
      targetValue,
      currentValue,
      message,
    }),
  });
}

/**
 * Send test email (for development/testing)
 */
export async function sendTestEmail(to: string) {
  return sendEmail({
    to,
    subject: 'Test Email - Dólar Gaucho',
    react: WelcomeEmail({ email: to, name: 'Test User' }),
  });
}

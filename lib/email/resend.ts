/**
 * Resend Email Service
 *
 * Handles all email sending through Resend API
 */

import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email configuration
 */
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Dólar Gaucho <noreply@dolargaucho.com>',
  replyTo: process.env.EMAIL_REPLY_TO || 'soporte@dolargaucho.com',
} as const;

/**
 * Send email with Resend
 *
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param react - React email component
 * @returns Promise with email ID or error
 */
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      react,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      console.error('[Resend] Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('[Resend] Email sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Resend] Failed to send email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send multiple emails in batch
 *
 * @param emails - Array of emails to send
 * @returns Promise with results
 */
export async function sendBatchEmails(
  emails: Array<{
    to: string;
    subject: string;
    react: React.ReactElement;
  }>
) {
  try {
    const results = await Promise.allSettled(emails.map((email) => sendEmail(email)));

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`[Resend] Batch send complete: ${succeeded} succeeded, ${failed} failed`);

    return { succeeded, failed, results };
  } catch (error) {
    console.error('[Resend] Batch send failed:', error);
    throw error;
  }
}

export default resend;

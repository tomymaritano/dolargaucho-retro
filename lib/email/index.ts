/**
 * Email Service - Main exports
 */

export { sendEmail, sendBatchEmails, EMAIL_CONFIG } from './resend';
export {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAlertTriggeredEmail,
  sendTestEmail,
} from './templates';

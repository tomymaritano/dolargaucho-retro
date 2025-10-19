/**
 * Password Reset Email Sender
 *
 * Sends password reset emails to users
 * TODO: Integrate with your email service (Resend, SendGrid, etc.)
 */

/**
 * Send password reset email
 *
 * @param email - User email
 * @param name - User name
 * @param resetUrl - Password reset URL with token
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
): Promise<void> {
  // TODO: Replace this with your actual email service integration
  // For now, just log to console (for development)

  console.log('\n' + '='.repeat(80));
  console.log('📧 PASSWORD RESET EMAIL');
  console.log('='.repeat(80));
  console.log(`To: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log('='.repeat(80) + '\n');

  // PRODUCTION: Uncomment and configure your email service
  /*
  // Example with Resend (https://resend.com)
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Dólar Gaucho <noreply@dolargaucho.com>',
    to: email,
    subject: 'Restablecer tu contraseña',
    html: `
      <h1>Hola ${name},</h1>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
        Restablecer contraseña
      </a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este email.</p>
      <p>Saludos,<br>El equipo de Dólar Gaucho</p>
    `,
  });
  */

  // For development, we just log. In production, integrate with email service above.
  return Promise.resolve();
}

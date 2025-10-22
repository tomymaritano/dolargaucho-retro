/**
 * Email Test Endpoint
 *
 * POST /api/email/test
 * Sends a test email to verify Resend configuration
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { sendWelcomeEmail } from '@/lib/email';

interface SuccessResponse {
  success: true;
  message: string;
  emailSent: boolean;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type TestEmailResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestEmailResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  }

  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email es requerido',
      });
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'RESEND_API_KEY no está configurada en las variables de entorno',
      });
    }

    console.log('[Test Email] Sending test welcome email to:', email);

    // Send test welcome email
    const result = await sendWelcomeEmail({
      to: email,
      name: name || 'Usuario de Prueba',
    });

    if (result.success) {
      console.log('[Test Email] ✅ Email enviado correctamente. ID:', result.id);
      return res.status(200).json({
        success: true,
        message: `Email de prueba enviado exitosamente a ${email}`,
        emailSent: true,
      });
    } else {
      console.error('[Test Email] ❌ Error al enviar email:', result.error);
      return res.status(500).json({
        success: false,
        error: `Error al enviar email: ${result.error}`,
      });
    }
  } catch (error) {
    console.error('[Test Email] Error inesperado:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
    });
  }
}

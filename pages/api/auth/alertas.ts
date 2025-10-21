/**
 * User Alerts API Endpoint
 *
 * GET /api/auth/alertas - Get user's alerts
 * POST /api/auth/alertas - Create new alert
 * PUT /api/auth/alertas - Update user's alerts (bulk sync)
 * DELETE /api/auth/alertas - Delete all alerts
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth/jwt';
import { getAuthToken } from '@/lib/auth/cookies';
import {
  getUserAlerts,
  createUserAlert,
  deleteUserAlert,
  deleteAllUserAlerts,
} from '@/lib/db/queries';
import type { Alerta } from '@/types/alertas';

interface AlertasData {
  alertas: Alerta[];
}

interface SuccessResponse {
  success: true;
  alertas: Alerta[];
}

interface ErrorResponse {
  success: false;
  error: string;
}

type AlertasResponse = SuccessResponse | ErrorResponse;

/**
 * Convert database alert to frontend alert format
 */
function dbAlertToFrontend(dbAlert: any): Alerta {
  return {
    id: dbAlert.id,
    tipo: dbAlert.tipo,
    nombre: dbAlert.nombre,
    condicion: dbAlert.condicion,
    valorObjetivo: parseFloat(dbAlert.valor_objetivo),
    estado: dbAlert.estado,
    casaDolar: dbAlert.metadata?.casaDolar,
    fechaCreacion: dbAlert.fecha_creacion || dbAlert.created_at,
    fechaUltimaVerificacion: dbAlert.fecha_ultima_verificacion,
    fechaDisparada: dbAlert.fecha_disparada,
    notificacionEnviada: dbAlert.notificacion_enviada,
    mensaje: dbAlert.mensaje,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AlertasResponse>) {
  try {
    // Get token from cookie
    const token = getAuthToken(req.headers.cookie);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    // Verify JWT token
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado',
      });
    }

    const userId = payload.userId;

    // GET - Return user's alerts
    if (req.method === 'GET') {
      const dbAlerts = await getUserAlerts(userId);
      const alertas = dbAlerts.map(dbAlertToFrontend);

      return res.status(200).json({
        success: true,
        alertas,
      });
    }

    // POST - Create new alert
    if (req.method === 'POST') {
      const { tipo, nombre, condicion, valorObjetivo, casaDolar, mensaje } = req.body;

      if (!tipo || !nombre || !condicion || valorObjetivo === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos',
        });
      }

      const newAlert = await createUserAlert(userId, {
        tipo,
        nombre,
        condicion,
        valorObjetivo,
        casaDolar,
        mensaje,
      });

      return res.status(201).json({
        success: true,
        alertas: [dbAlertToFrontend(newAlert)],
      });
    }

    // PUT - Bulk update alerts (for sync)
    if (req.method === 'PUT') {
      const { alertas } = req.body as Partial<AlertasData>;

      if (!alertas || !Array.isArray(alertas)) {
        return res.status(400).json({
          success: false,
          error: 'Debe proporcionar un array de alertas',
        });
      }

      // Delete all existing alerts
      await deleteAllUserAlerts(userId);

      // Create new alerts
      const newDbAlerts = await Promise.all(
        alertas.map((alerta) =>
          createUserAlert(userId, {
            tipo: alerta.tipo,
            nombre: alerta.nombre,
            condicion: alerta.condicion,
            valorObjetivo: alerta.valorObjetivo,
            casaDolar: alerta.casaDolar,
            mensaje: alerta.mensaje,
          })
        )
      );

      return res.status(200).json({
        success: true,
        alertas: newDbAlerts.map(dbAlertToFrontend),
      });
    }

    // DELETE - Delete specific alert or all alerts
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (id && typeof id === 'string') {
        // Delete specific alert
        await deleteUserAlert(id, userId);
        return res.status(200).json({
          success: true,
          alertas: [],
        });
      }

      // Delete all alerts
      await deleteAllUserAlerts(userId);

      return res.status(200).json({
        success: true,
        alertas: [],
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Método no permitido',
    });
  } catch (error) {
    console.error('Alertas API error:', error);

    return res.status(500).json({
      success: false,
      error: 'Error al procesar alertas',
    });
  }
}

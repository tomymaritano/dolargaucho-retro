/**
 * Sistema de Alertas - Types
 * Permite a los usuarios configurar notificaciones cuando ciertos indicadores
 * alcancen valores específicos
 */

export type TipoAlerta = 'dolar' | 'inflacion' | 'riesgo-pais' | 'uva' | 'tasa';

export type CondicionAlerta = 'mayor' | 'menor' | 'igual';

export type EstadoAlerta = 'activa' | 'disparada' | 'pausada';

/**
 * Casa de dólar para alertas de tipo 'dolar'
 */
export type CasaDolar =
  | 'oficial'
  | 'blue'
  | 'bolsa'
  | 'contadoconliqui'
  | 'tarjeta'
  | 'mayorista'
  | 'cripto';

/**
 * Configuración de una alerta
 */
export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  nombre: string; // Nombre descriptivo dado por el usuario
  condicion: CondicionAlerta;
  valorObjetivo: number;
  estado: EstadoAlerta;

  // Metadata específica por tipo
  casaDolar?: CasaDolar; // Solo para tipo 'dolar'

  // Timestamps
  fechaCreacion: string;
  fechaUltimaVerificacion?: string;
  fechaDisparada?: string;

  // Notificaciones
  notificacionEnviada: boolean;
  mensaje?: string; // Mensaje personalizado cuando se dispara
}

/**
 * Datos para crear una nueva alerta
 */
export interface CrearAlertaInput {
  tipo: TipoAlerta;
  nombre: string;
  condicion: CondicionAlerta;
  valorObjetivo: number;
  casaDolar?: CasaDolar;
  mensaje?: string;
}

/**
 * Resultado de verificación de una alerta
 */
export interface VerificacionAlerta {
  alertaId: string;
  disparada: boolean;
  valorActual: number;
  valorObjetivo: number;
  timestamp: string;
}

/**
 * Estadísticas de alertas del usuario
 */
export interface EstadisticasAlertas {
  total: number;
  activas: number;
  disparadas: number;
  pausadas: number;
}

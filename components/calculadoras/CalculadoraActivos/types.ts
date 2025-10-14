export type TipoActivo = 'vehiculo' | 'inmueble' | 'efectivo' | 'inversion' | 'otro';
export type Moneda = 'ARS' | 'USD';

export interface Activo {
  tipo: TipoActivo;
  nombre?: string;
  fechaCompra: Date;
  precioCompra: number;
  monedaCompra: Moneda;
  fechaVenta: Date;
  precioVenta: number;
  monedaVenta: Moneda;
  costosAdicionales?: number;
}

export interface ComparativaResultado {
  valorFinal: number;
  ganancia: number;
  rentabilidad: number;
  diferenciaPorcentual: number;
}

export interface ResultadoAnalisis {
  rentabilidadNominal: number;
  rentabilidadReal: number;
  inflacionAcumulada: number;
  valorAjustadoInflacion: number;
  gananciaAbsoluta: number;
  gananciaReal: number;
  comparativas: {
    dolarBlue?: ComparativaResultado;
    dolarOficial?: ComparativaResultado;
    uva?: ComparativaResultado;
  };
}

export interface DatosInflacion {
  fecha: string;
  valor: number; // IPC mensual en porcentaje
}

export interface DatosCotizacion {
  fecha: string;
  compra: number;
  venta: number;
  casa: string;
}

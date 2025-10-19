/**
 * Utilidades de formateo para números y monedas
 * Siguiendo el formato argentino: punto para miles, coma para decimales
 */

/**
 * Formatea un número con el formato argentino
 * @param num - Número a formatear
 * @param decimals - Cantidad de decimales (default: 2)
 * @returns String formateado (ej: "1.234,56")
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formatea un precio en dólares con el formato argentino
 * Ajusta automáticamente los decimales según el valor
 * @param price - Precio a formatear
 * @returns String formateado con símbolo $ (ej: "$1.234,56")
 */
export function formatPrice(price: number): string {
  let decimals = 2;

  // Para precios muy pequeños (< $0.01), mostrar más decimales
  if (price < 0.01) {
    decimals = 6;
  } else if (price < 1) {
    decimals = 4;
  }

  return `$${formatNumber(price, decimals)}`;
}

/**
 * Formatea un precio en dólares usando Intl.NumberFormat
 * Ajusta automáticamente los decimales según el valor
 * @param price - Precio a formatear
 * @returns String formateado con símbolo USD (ej: "US$ 1,234.56")
 */
export function formatPriceUSD(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
}

/**
 * Formatea un precio en pesos argentinos
 * @param price - Precio a formatear
 * @returns String formateado con símbolo $ (ej: "$1.234,56 ARS")
 */
export function formatPriceARS(price: number): string {
  return `$${formatNumber(price, 2)}`;
}

/**
 * Formatea números grandes (market cap, volumen)
 * Usa K, M, B para miles, millones, billones
 * @param num - Número a formatear
 * @param decimals - Cantidad de decimales (default: 2)
 * @returns String formateado (ej: "$1,23M")
 */
export function formatCompactNumber(num: number, decimals: number = 2): string {
  if (num >= 1_000_000_000_000) {
    return `$${formatNumber(num / 1_000_000_000_000, decimals)}T`;
  }
  if (num >= 1_000_000_000) {
    return `$${formatNumber(num / 1_000_000_000, decimals)}B`;
  }
  if (num >= 1_000_000) {
    return `$${formatNumber(num / 1_000_000, decimals)}M`;
  }
  if (num >= 1_000) {
    return `$${formatNumber(num / 1_000, decimals)}K`;
  }
  return `$${formatNumber(num, decimals)}`;
}

/**
 * Formatea un porcentaje
 * @param percentage - Porcentaje a formatear
 * @param decimals - Cantidad de decimales (default: 2)
 * @param includeSign - Si incluir el signo + para números positivos (default: false)
 * @returns String formateado (ej: "+5,23%")
 */
export function formatPercentage(
  percentage: number,
  decimals: number = 2,
  includeSign: boolean = false
): string {
  const formatted = formatNumber(Math.abs(percentage), decimals);
  const sign = percentage > 0 ? '+' : percentage < 0 ? '-' : '';

  if (includeSign || percentage < 0) {
    return `${sign}${formatted}%`;
  }

  return `${formatted}%`;
}

/**
 * Formatea una fecha en formato argentino
 * @param date - Fecha a formatear (string o Date)
 * @returns String formateado (ej: "25/12/2024 15:30")
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Formatea una fecha en formato corto
 * @param date - Fecha a formatear (string o Date)
 * @returns String formateado (ej: "25/12/2024")
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formatea una hora
 * @param date - Fecha a formatear (string o Date)
 * @returns String formateado (ej: "15:30")
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

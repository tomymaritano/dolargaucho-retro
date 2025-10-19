/**
 * FAQs - Preguntas Frecuentes
 * Single source of truth para todas las FAQs de la aplicación
 *
 * Usado en:
 * - components/Faqs.tsx (landing page)
 * - pages/help.tsx (help center)
 */

export interface FAQ {
  question: string;
  answer: string;
}

/**
 * FAQs principales para landing page y help center
 * Estas son las preguntas más frecuentes que ven los usuarios
 */
export const FAQS: FAQ[] = [
  {
    question: '¿Es gratis usar Dólar Gaucho?',
    answer:
      'Sí, 100% gratuito. No hay planes premium, suscripciones ni costos ocultos. Accedés a todas las funcionalidades sin registrarte ni proporcionar tarjeta de crédito.',
  },
  {
    question: '¿Cada cuánto se actualizan los datos?',
    answer:
      'Los dólares se actualizan diariamente con datos oficiales de DolarAPI y ArgentinaDatos (BCRA/INDEC). Las criptomonedas se actualizan en tiempo real desde CoinGecko. Los indicadores económicos según disponibilidad de cada fuente.',
  },
  {
    question: '¿Qué cotizaciones del dólar puedo ver?',
    answer:
      'Oficial, Blue, Tarjeta, MEP, CCL, Cripto, Mayorista, y más. En total 15+ tipos de dólar con históricos, gráficos y alertas configurables para cada uno.',
  },
  {
    question: '¿Tiene app móvil?',
    answer:
      'La app es completamente responsive y funciona perfecto en cualquier dispositivo móvil desde el navegador. Estamos trabajando en una PWA instalable que estará disponible próximamente (Q2 2025).',
  },
  {
    question: '¿De dónde vienen los datos?',
    answer:
      'Integramos 6 fuentes oficiales: DolarAPI (cotizaciones), ArgentinaDatos (BCRA/INDEC), CoinGecko (cryptos), FRED (datos USA), ECB (datos Europa), y Congreso argentino (actas y votaciones). Todo verificable y trazable.',
  },
];

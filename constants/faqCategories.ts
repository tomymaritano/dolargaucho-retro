/**
 * FAQ Categories - Categorización para Help Center
 * Agrupa FAQs por categoría con iconos y metadata
 */

import { IconType } from 'react-icons';
import {
  FaQuestionCircle,
  FaChartLine,
  FaCalculator,
  FaBell,
  FaBook,
  FaExchangeAlt,
} from 'react-icons/fa';
import { FAQ } from './faqs';

export interface FAQCategory {
  title: string;
  icon: IconType;
  faqs: FAQ[];
}

/**
 * FAQs organizadas por categoría para el Help Center
 * Incluye las 8 FAQs principales + FAQs específicas por categoría
 */
export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    title: 'General',
    icon: FaQuestionCircle,
    faqs: [
      {
        question: '¿Qué es Dólar Gaucho?',
        answer:
          'Dólar Gaucho es una plataforma completa de información financiera argentina que centraliza cotizaciones del dólar, criptomonedas, inflación, riesgo país, calculadoras financieras, calendario económico, datos políticos y más. Todo en un solo dashboard profesional.',
      },
      {
        question: '¿Es gratis usar Dólar Gaucho?',
        answer:
          'Sí, 100% gratuito. No hay planes premium, suscripciones ni costos ocultos. Accedés a todas las funcionalidades sin registrarte ni proporcionar tarjeta de crédito.',
      },
      {
        question: '¿Dólar Gaucho es un sitio oficial?',
        answer:
          'No, Dólar Gaucho es un servicio independiente que brinda información actualizada sobre el mercado cambiario y financiero en Argentina. No estamos afiliados con ninguna entidad gubernamental. Usamos fuentes oficiales verificables.',
      },
      {
        question: '¿Los datos son confiables?',
        answer:
          'Sí, integramos 6 fuentes oficiales: DolarAPI (cotizaciones), ArgentinaDatos (BCRA/INDEC), CoinGecko (cryptos), FRED (datos USA), ECB (datos Europa), y Congreso argentino (actas y votaciones). Todo verificable y trazable.',
      },
      {
        question: '¿Cada cuánto se actualizan los datos?',
        answer:
          'Los dólares se actualizan diariamente con datos oficiales de DolarAPI y ArgentinaDatos (BCRA/INDEC). Las criptomonedas se actualizan en tiempo real desde CoinGecko. Los indicadores económicos según disponibilidad de cada fuente.',
      },
    ],
  },
  {
    title: 'Cotizaciones',
    icon: FaChartLine,
    faqs: [
      {
        question: '¿Qué cotizaciones del dólar puedo ver?',
        answer:
          'Oficial, Blue, Tarjeta, MEP, CCL, Cripto, Mayorista, y más. En total 15+ tipos de dólar con históricos, gráficos y alertas configurables para cada uno.',
      },
      {
        question: '¿Qué significa cada tipo de dólar?',
        answer:
          'Oficial: tipo de cambio regulado por el BCRA. Blue: mercado paralelo o informal. MEP: operaciones bursátiles con bonos. CCL: transferencias al exterior vía bonos. Cripto: cotización en exchanges de criptomonedas. Tarjeta: dólar oficial + impuestos (PAIS + Ganancias).',
      },
      {
        question: '¿Cómo funcionan las variaciones diarias?',
        answer:
          'Las variaciones muestran el cambio porcentual entre el precio actual y el del día anterior. Verde indica baja (favorable para comprar), rojo indica suba (desfavorable para comprar). Los porcentajes te ayudan a identificar tendencias rápidamente.',
      },
      {
        question: '¿Puedo agregar cotizaciones a favoritos?',
        answer:
          'Sí, en el Dashboard podés marcar tus cotizaciones favoritas haciendo clic en el botón de favoritos. Esto las destacará en una sección especial para acceder rápidamente a las que más te interesan.',
      },
      {
        question: '¿Los gráficos son interactivos?',
        answer:
          'Sí, todos los gráficos son interactivos con tooltips, zoom, y filtros de período. Podés comparar múltiples cotizaciones, ver variaciones porcentuales, y analizar tendencias históricas.',
      },
    ],
  },
  {
    title: 'Criptomonedas',
    icon: FaExchangeAlt,
    faqs: [
      {
        question: '¿Qué criptomonedas puedo consultar?',
        answer:
          'Bitcoin, Ethereum, USDT, USDC, DAI, y las principales altcoins. Todas con cotización en tiempo real desde CoinGecko, gráficos de sparklines, y variaciones de 24h.',
      },
      {
        question: '¿Las cryptos se actualizan en tiempo real?',
        answer:
          'Sí, las criptomonedas se actualizan en tiempo real desde CoinGecko (cada pocos minutos). A diferencia de los dólares que se actualizan diariamente, las cryptos reflejan el mercado global 24/7.',
      },
      {
        question: '¿Puedo convertir entre cryptos y pesos?',
        answer:
          'Sí, en la sección Calculadoras tenés un conversor de criptomonedas que te permite calcular equivalencias entre cryptos, dólares y pesos argentinos con cotizaciones actualizadas.',
      },
    ],
  },
  {
    title: 'Calculadoras',
    icon: FaCalculator,
    faqs: [
      {
        question: '¿Qué calculadoras están disponibles?',
        answer:
          'Calculadora de Inflación (poder adquisitivo), Plazo Fijo (rendimiento), UVA (ajuste por inflación), Conversores de Moneda y Crypto, Calculadora de Activos (comparación de inversiones), y más.',
      },
      {
        question: '¿Cómo funciona la calculadora de inflación?',
        answer:
          'Ingresás un monto inicial y período de proyección. La calculadora estima la pérdida de valor del dinero debido a la inflación, mostrándote el poder adquisitivo futuro basado en la tasa de inflación interanual actual del INDEC.',
      },
      {
        question: '¿Las calculadoras usan datos reales?',
        answer:
          'Sí, todas las calculadoras utilizan datos actualizados de APIs oficiales: tasas de inflación (INDEC vía ArgentinaDatos), cotizaciones de divisas (DolarAPI), valores UVA (BCRA), y tasas de plazo fijo.',
      },
      {
        question: '¿Puedo exportar los resultados?',
        answer:
          'Cada tabla tiene opciones para copiar valores, compartir cotizaciones específicas, y agregar a favoritos. Próximamente: exportación a CSV y API pública para desarrolladores.',
      },
    ],
  },
  {
    title: 'Dashboard y Alertas',
    icon: FaBell,
    faqs: [
      {
        question: '¿Qué es el Dashboard?',
        answer:
          'El Dashboard es tu panel personalizado donde podés ver cotizaciones en tiempo real, favoritos, alertas configuradas, gráficos históricos, calculadoras y todas las herramientas profesionales en un solo lugar.',
      },
      {
        question: '¿Necesito crear una cuenta?',
        answer:
          'No, el Dashboard es 100% gratuito y público. Podés acceder a todas las funcionalidades sin registrarte. En el futuro agregaremos autenticación opcional para sincronizar favoritos y alertas entre dispositivos.',
      },
      {
        question: '¿Cómo funcionan las alertas de precio?',
        answer:
          'En la sección Alertas configurás el tipo de cambio, precio objetivo, y condición (mayor/menor). Cuando se cumple, recibís notificación. Son ilimitadas, gratuitas, y podés pausarlas o eliminarlas cuando quieras.',
      },
      {
        question: '¿Puedo personalizar el Dashboard?',
        answer:
          'Sí, podés marcar tus cotizaciones favoritas, configurar alertas personalizadas, y próximamente: ordenar secciones, elegir qué widgets mostrar, y crear dashboards personalizados.',
      },
    ],
  },
  {
    title: 'Técnico',
    icon: FaBook,
    faqs: [
      {
        question: '¿Tiene app móvil?',
        answer:
          'Sí, Dólar Gaucho es una PWA (Progressive Web App). Podés instalarla desde el navegador en cualquier dispositivo y funciona offline. Misma experiencia que una app nativa sin ocupar espacio en tu teléfono.',
      },
      {
        question: '¿Puedo usar la API de Dólar Gaucho?',
        answer:
          'Actualmente no contamos con una API pública propia, pero estamos trabajando en ello. Mientras tanto, usamos APIs públicas como DolarAPI.com y ArgentinaDatos.com que podés consultar directamente.',
      },
      {
        question: '¿Es open source?',
        answer:
          'Sí, Dólar Gaucho es un proyecto open source. Podés ver el código fuente, contribuir, y reportar bugs en nuestro repositorio de GitHub. Construido con Next.js, React, TypeScript, TailwindCSS, y TanStack Query.',
      },
      {
        question: '¿Qué tecnologías usa la plataforma?',
        answer:
          'Next.js 14, React 18, TypeScript, TailwindCSS, TanStack Query, Framer Motion, Chart.js, React Icons, y más. Stack moderno optimizado para performance y developer experience.',
      },
      {
        question: '¿Cómo reporto un bug o sugiero una mejora?',
        answer:
          'Podés reportar bugs o sugerir mejoras a través del formulario de contacto en la página principal, o directamente en nuestro repositorio de GitHub creando un issue.',
      },
    ],
  },
];

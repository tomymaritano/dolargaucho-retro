/**
 * Search Configuration
 * Configuración centralizada para el sistema de búsqueda fuzzy (Fuse.js)
 */

/**
 * Configuración de Fuse.js para búsqueda fuzzy
 *
 * @see https://www.fusejs.io/api/options.html
 */
export const FUSE_CONFIG = {
  /**
   * Threshold determina qué tan estricta es la búsqueda
   * 0.0 = coincidencia exacta
   * 1.0 = coincide con cualquier cosa
   *
   * Valor recomendado: 0.3 - 0.5 para búsqueda flexible pero relevante
   */
  threshold: 0.4,

  /**
   * Número mínimo de caracteres que debe tener el patrón de búsqueda
   * Ayuda a evitar resultados irrelevantes con búsquedas muy cortas
   */
  minMatchCharLength: 2,

  /**
   * Si es true, ignora la ubicación del texto en la búsqueda
   * Útil cuando el término puede aparecer en cualquier parte
   */
  ignoreLocation: true,

  /**
   * Incluir el score de relevancia en los resultados
   * Útil para ordenar por relevancia
   */
  includeScore: true,

  /**
   * Campos en los que buscar y sus pesos relativos
   * Mayor peso = más importante en la búsqueda
   */
  keys: [
    { name: 'title', weight: 2 }, // Título es más importante
    { name: 'subtitle', weight: 1 }, // Subtítulo peso normal
    { name: 'type', weight: 0.5 }, // Tipo menos importante
  ],
};

/**
 * Configuración del comportamiento de búsqueda
 */
export const SEARCH_CONFIG = {
  /**
   * Número mínimo de caracteres para activar la búsqueda
   * Evita búsquedas con muy pocas letras
   */
  minQueryLength: 2,

  /**
   * Máximo número de resultados a mostrar
   * Limita la lista para mejor UX
   */
  maxResults: 8,

  /**
   * Delay en milisegundos antes de ejecutar búsqueda (debounce)
   * Mejora performance evitando búsquedas mientras el usuario escribe
   */
  debounceMs: 150,
} as const;

/**
 * Type helpers para TypeScript
 */
export type FuseConfig = typeof FUSE_CONFIG;
export type SearchConfig = typeof SEARCH_CONFIG;

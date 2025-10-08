import { API_CONFIG, CACHE_CONFIG } from '@/lib/config/api';

describe('API Configuration', () => {
  describe('API_CONFIG', () => {
    it('has dolarAPI configuration', () => {
      expect(API_CONFIG.dolarAPI).toBeDefined();
      expect(API_CONFIG.dolarAPI.baseUrl).toBe('https://dolarapi.com/v1');
    });

    it('has argentinaData configuration', () => {
      expect(API_CONFIG.argentinaData).toBeDefined();
      expect(API_CONFIG.argentinaData.baseUrl).toBe('https://api.argentinadatos.com/v1');
    });

    it('has correct endpoint paths', () => {
      expect(API_CONFIG.dolarAPI.endpoints.dolares).toBe('/dolares');
      expect(API_CONFIG.argentinaData.endpoints.inflacion).toBe('/finanzas/indices/inflacion');
    });

    it('has senadores endpoint', () => {
      expect(API_CONFIG.argentinaData.endpoints.senadores).toBe('/senado/senadores');
    });
  });

  describe('CACHE_CONFIG', () => {
    it('is defined and has properties', () => {
      expect(CACHE_CONFIG).toBeDefined();
      expect(typeof CACHE_CONFIG).toBe('object');
    });

    it('has cache configuration structure', () => {
      // Check that cache config exists and has staleTime properties
      const cacheKeys = Object.keys(CACHE_CONFIG);
      expect(cacheKeys.length).toBeGreaterThan(0);

      // Verify at least one cache config has staleTime
      const hasStaleTime = cacheKeys.some((key) => {
        const config = CACHE_CONFIG[key as keyof typeof CACHE_CONFIG];
        return config && typeof config === 'object' && 'staleTime' in config;
      });
      expect(hasStaleTime).toBe(true);
    });
  });
});

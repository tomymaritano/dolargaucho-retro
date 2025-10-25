/**
 * Dólar Gaucho - Service Worker
 *
 * Powered by Serwist (Workbox successor)
 * Enables offline functionality and caching for the PWA
 */

import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry } from 'serwist';
import { Serwist } from 'serwist';

// Type declaration for self.__WB_MANIFEST
declare global {
  interface WorkerGlobalScope {
    // Injected by Serwist during build
    __WB_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

// Initialize Serwist
const serwist = new Serwist({
  precacheEntries: self.__WB_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

/**
 * Sync Engine
 *
 * Reusable synchronization system for cross-device state management
 *
 * @example
 * ```ts
 * import { createSyncStore } from '@/lib/sync';
 *
 * const useMyStore = createSyncStore({
 *   name: 'my-store',
 *   endpoint: '/api/my-data',
 *   initialState: { items: [] },
 *   conflictStrategy: 'merge-union'
 * });
 * ```
 */

// Main factory
export { createSyncStore } from './createSyncStore';

// Queue system
export { SyncQueue, createSyncQueue } from './queue';

// Types
export type {
  SyncStatus,
  ConflictStrategy,
  SyncAction,
  SyncConfig,
  SyncResult,
  SyncableStore,
  QueueItem,
  SyncMetadata,
  SyncPayload,
} from './types';

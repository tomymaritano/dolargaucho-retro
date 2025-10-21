/**
 * Sync Engine - Type Definitions
 *
 * Shared types for the synchronization system
 */

/**
 * Sync status for UI feedback
 */
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

/**
 * Conflict resolution strategies
 */
export type ConflictStrategy =
  | 'last-write-wins' // Server timestamp wins
  | 'merge-union' // Merge arrays (union of both)
  | 'client-wins' // Client always wins (optimistic)
  | 'server-wins' // Server always wins (conservative)
  | 'custom'; // Custom resolver function

/**
 * Action to be synced
 */
export interface SyncAction<T = any> {
  id: string;
  type: string; // 'add', 'remove', 'update', 'replace'
  payload: T;
  timestamp: number;
  retries: number;
}

/**
 * Sync configuration
 */
export interface SyncConfig<T> {
  /**
   * Store name (used for localStorage key)
   */
  name: string;

  /**
   * API endpoint for syncing
   * @example '/api/auth/favorites'
   */
  endpoint: string;

  /**
   * Initial state
   */
  initialState: T;

  /**
   * Conflict resolution strategy
   * @default 'last-write-wins'
   */
  conflictStrategy?: ConflictStrategy;

  /**
   * Custom conflict resolver
   */
  customResolver?: (local: T, remote: T) => T;

  /**
   * Enable optimistic updates
   * @default true
   */
  optimistic?: boolean;

  /**
   * Max retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Retry delay in ms (will use exponential backoff)
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Sync debounce time in ms
   * @default 500
   */
  debounceMs?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Sync result
 */
export interface SyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  conflictResolved?: boolean;
}

/**
 * Store with sync capabilities
 */
export interface SyncableStore<T> {
  // Sync metadata
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
  pendingActions: number;

  // Actions
  syncToBackend: () => Promise<void>;
  loadFromBackend: (data: T) => void;
  forceSync: () => Promise<void>;
  clearSyncQueue: () => void;

  // Status
  isSyncing: () => boolean;
  hasPendingChanges: () => boolean;
}

/**
 * Sync queue item
 */
export interface QueueItem {
  id: string;
  action: SyncAction;
  addedAt: number;
  attempts: number;
}

/**
 * Sync metadata for conflict resolution
 */
export interface SyncMetadata {
  version: number;
  timestamp: number;
  deviceId: string;
  userId?: string;
}

/**
 * Sync payload with metadata
 */
export interface SyncPayload<T> {
  data: T;
  metadata: SyncMetadata;
}

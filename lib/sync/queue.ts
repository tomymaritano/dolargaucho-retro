/**
 * Sync Queue
 *
 * Manages a queue of sync actions with retry logic and exponential backoff
 */

import type { SyncAction, QueueItem } from './types';

export class SyncQueue {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private maxRetries: number;
  private baseDelay: number;
  private debug: boolean;

  constructor(options: { maxRetries?: number; baseDelay?: number; debug?: boolean } = {}) {
    this.maxRetries = options.maxRetries ?? 3;
    this.baseDelay = options.baseDelay ?? 1000;
    this.debug = options.debug ?? false;
  }

  /**
   * Add action to queue
   */
  add(action: SyncAction): void {
    const item: QueueItem = {
      id: action.id,
      action,
      addedAt: Date.now(),
      attempts: 0,
    };

    this.queue.push(item);
    this.log('Action added to queue:', action.type);

    // Start processing if not already processing
    if (!this.isProcessing) {
      this.process();
    }
  }

  /**
   * Process queue
   */
  private async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.log('Processing queue, items:', this.queue.length);

    while (this.queue.length > 0) {
      const item = this.queue[0];

      try {
        this.log(`Processing action: ${item.action.type} (attempt ${item.attempts + 1})`);

        // Execute action (will be provided by the store)
        // This is a placeholder - actual execution happens in createSyncStore
        item.attempts++;

        // Remove from queue on success
        this.queue.shift();
        this.log('Action completed successfully');
      } catch (error) {
        this.log('Action failed:', error);

        // Check if we should retry
        if (item.attempts >= this.maxRetries) {
          this.log('Max retries reached, removing from queue');
          this.queue.shift();
        } else {
          // Calculate delay with exponential backoff
          const delay = this.calculateBackoff(item.attempts);
          this.log(`Retrying in ${delay}ms`);

          // Wait before retry
          await this.sleep(delay);
        }
      }
    }

    this.isProcessing = false;
    this.log('Queue processing complete');
  }

  /**
   * Get next item without removing it
   */
  peek(): QueueItem | null {
    return this.queue[0] || null;
  }

  /**
   * Remove first item from queue
   */
  shift(): QueueItem | null {
    return this.queue.shift() || null;
  }

  /**
   * Clear entire queue
   */
  clear(): void {
    this.queue = [];
    this.log('Queue cleared');
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Check if currently processing
   */
  isActive(): boolean {
    return this.isProcessing;
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoff(attempt: number): number {
    // Exponential backoff: baseDelay * 2^attempt
    // Example: 1s, 2s, 4s, 8s, 16s...
    const delay = this.baseDelay * Math.pow(2, attempt);
    // Add jitter to prevent thundering herd (±20%)
    const jitter = delay * 0.2 * (Math.random() - 0.5);
    return Math.min(delay + jitter, 30000); // Max 30 seconds
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Debug logging
   */
  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[SyncQueue]', ...args);
    }
  }
}

/**
 * Create a new sync queue instance
 */
export function createSyncQueue(options?: {
  maxRetries?: number;
  baseDelay?: number;
  debug?: boolean;
}): SyncQueue {
  return new SyncQueue(options);
}

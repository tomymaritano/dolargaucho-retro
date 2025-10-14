/**
 * Analytics utility for tracking user events
 * Supports Google Analytics 4, Vercel Analytics, and custom events
 */

interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Check if we're in production
 */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Analytics class for managing tracking
 */
class Analytics {
  /**
   * Track a custom event
   */
  track(eventName: string, properties?: Record<string, any>) {
    if (!isBrowser || !isProduction) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', eventName, properties);
      }
      return;
    }

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }

    // Vercel Analytics
    if (window.va) {
      window.va('track', eventName, properties);
    }

    // Custom analytics endpoint (optional)
    this.sendToCustomEndpoint(eventName, properties);
  }

  /**
   * Track page view
   */
  pageView(url: string, title?: string) {
    if (!isBrowser || !isProduction) return;

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: url,
        page_title: title,
      });
    }

    // Track as event
    this.track('page_view', { url, title });
  }

  /**
   * Track user interactions
   */
  interaction(action: string, category: string, label?: string, value?: number) {
    this.track('interaction', {
      action,
      category,
      label,
      value,
    });
  }

  /**
   * Track errors
   */
  error(errorName: string, errorMessage: string, errorStack?: string) {
    this.track('error', {
      error_name: errorName,
      error_message: errorMessage,
      error_stack: errorStack,
    });
  }

  /**
   * Track timing/performance
   */
  timing(category: string, name: string, value: number) {
    this.track('timing', {
      timing_category: category,
      timing_name: name,
      timing_value: value,
    });
  }

  /**
   * Send to custom analytics endpoint
   * Useful for storing analytics in your own database
   */
  private async sendToCustomEndpoint(eventName: string, properties?: Record<string, any>) {
    if (!process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) return;

    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          properties,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        }),
        // Don't wait for response
        keepalive: true,
      });
    } catch (error) {
      // Silently fail - analytics should never break the app
      if (process.env.NODE_ENV === 'development') {
        console.error('Analytics error:', error);
      }
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export event tracking helpers for common use cases
export const trackEvent = {
  // User interactions
  favoriteAdded: (type: 'dolar' | 'currency', identifier: string) => {
    analytics.track('favorite_added', { type, identifier });
  },

  favoriteRemoved: (type: 'dolar' | 'currency', identifier: string) => {
    analytics.track('favorite_removed', { type, identifier });
  },

  alertCreated: (type: string, condition: string, value: number) => {
    analytics.track('alert_created', { type, condition, value });
  },

  alertTriggered: (alertId: string, value: number) => {
    analytics.track('alert_triggered', { alert_id: alertId, value });
  },

  // Calculator usage
  calculatorUsed: (calculatorType: string, inputs: Record<string, any>) => {
    analytics.track('calculator_used', { calculator_type: calculatorType, ...inputs });
  },

  // Sharing
  contentShared: (contentType: string, platform: string) => {
    analytics.track('content_shared', { content_type: contentType, platform });
  },

  contentCopied: (contentType: string) => {
    analytics.track('content_copied', { content_type: contentType });
  },

  // Export actions
  dataExported: (format: 'pdf' | 'csv' | 'excel', dataType: string) => {
    analytics.track('data_exported', { format, data_type: dataType });
  },

  // Navigation
  dashboardViewed: (section: string) => {
    analytics.track('dashboard_viewed', { section });
  },

  // Search
  searchPerformed: (query: string, resultsCount: number) => {
    analytics.track('search_performed', { query, results_count: resultsCount });
  },

  // Errors
  apiError: (endpoint: string, statusCode: number, errorMessage: string) => {
    analytics.error('api_error', `${endpoint}: ${errorMessage}`, `Status: ${statusCode}`);
  },
};

// TypeScript declarations for global analytics objects
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    va?: (command: 'track', eventName: string, properties?: Record<string, any>) => void;
  }
}

export default analytics;

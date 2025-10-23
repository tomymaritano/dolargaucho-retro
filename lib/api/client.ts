/**
 * HTTP Client with Interceptors
 *
 * Centralized Axios configuration with:
 * - Request logging
 * - Authentication headers
 * - Response error handling
 * - Token refresh on 401
 * - Rate limit handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { logger } from '@/lib/utils/logger';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Base API client configuration
 */
export const apiClient: AxiosInstance = axios.create({
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds authentication headers and logging
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request in development
    if (isDev) {
      logger.info('📤 API Request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    logger.error('❌ Request Error', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors, token refresh, and logging
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (isDev) {
      logger.info('📥 API Response', {
        status: response.status,
        url: response.config.url,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const newToken = await refreshAuthToken();

        if (newToken && originalRequest.headers) {
          // Update token in storage
          localStorage.setItem('auth_token', newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed - redirect to login
        logger.error('Token refresh failed', refreshError);

        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login?session_expired=true';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 429 - Rate Limit Exceeded
    if (error.response?.status === 429) {
      logger.warn('⚠️ Rate limit exceeded', {
        url: error.config?.url,
      });

      // Could show a toast notification here
      if (typeof window !== 'undefined') {
        console.warn('Rate limit exceeded. Please wait before making more requests.');
      }
    }

    // Handle 500 - Server Error
    if (error.response?.status === 500) {
      logger.error('🔥 Server Error', {
        url: error.config?.url,
        message: error.message,
      });
    }

    // Log all errors
    logger.error('API Error', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

/**
 * Refresh authentication token
 * Makes a call to /api/auth/refresh to get a new token
 */
async function refreshAuthToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      '/api/auth/refresh',
      {},
      {
        withCredentials: true, // Send cookies
      }
    );

    return response.data.token;
  } catch (error) {
    logger.error('Failed to refresh token', error);
    return null;
  }
}

/**
 * Helper function to handle API errors consistently
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Server responded with error
    if (error.response) {
      return error.response.data?.message || 'Error en el servidor';
    }

    // Request timeout
    if (error.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Intenta nuevamente.';
    }

    // Network error
    if (error.message === 'Network Error') {
      return 'Error de conexión. Verifica tu internet.';
    }
  }

  return 'Ocurrió un error inesperado';
}

export default apiClient;

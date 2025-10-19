import React, { Component, ReactNode } from 'react';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { logger } from '@/lib/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by boundary', error, {
      component: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
    });
    this.setState({ errorInfo });

    // TODO: Enviar a Sentry/LogRocket en producción
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-7xl w-full">
            {/* Card principal */}
            <div className="bg-panel border border-border rounded-2xl p-8 shadow-xl">
              {/* Icono y título */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-error/10 rounded-xl">
                  <FaExclamationTriangle className="text-error text-3xl" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Algo salió mal</h1>
                  <p className="text-secondary text-lg">
                    Ocurrió un error inesperado en la aplicación
                  </p>
                </div>
              </div>

              {/* Error message */}
              {this.state.error && (
                <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-lg">
                  <p className="text-sm font-mono text-error">{this.state.error.message}</p>
                </div>
              )}

              {/* Stack trace (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm text-secondary hover:text-foreground mb-2">
                    Ver detalles técnicos
                  </summary>
                  <div className="p-4 bg-background rounded-lg border border-border overflow-x-auto">
                    <pre className="text-xs text-secondary whitespace-pre-wrap font-mono">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand hover:bg-brand-light text-background-dark font-semibold rounded-lg transition-all active:scale-[0.98]"
                >
                  <FaRedo />
                  Intentar de nuevo
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-panel border border-border hover:bg-brand/10 hover:border-brand text-foreground font-semibold rounded-lg transition-all active:scale-[0.98]"
                >
                  <FaHome />
                  Volver al inicio
                </button>
              </div>

              {/* Info adicional */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-secondary leading-relaxed">
                  Si el problema persiste, por favor{' '}
                  <a
                    href="https://github.com/anthropics/claude-code/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    reportá el error en GitHub
                  </a>{' '}
                  o refrescá la página.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

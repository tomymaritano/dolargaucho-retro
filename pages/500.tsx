import Link from 'next/link';
import { FaHome, FaRedo, FaExclamationTriangle } from 'react-icons/fa';

export default function Custom500() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-7xl w-full text-center">
        {/* Card principal */}
        <div className="bg-panel border border-border rounded-2xl p-8 shadow-xl">
          {/* Icono de error */}
          <div className="mb-6 flex justify-center">
            <div className="p-6 bg-error/10 rounded-2xl">
              <FaExclamationTriangle className="text-error text-6xl" />
            </div>
          </div>

          {/* Número 500 */}
          <div className="mb-6">
            <h1 className="text-7xl font-bold text-error mb-4">500</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-error to-warning mx-auto rounded-full"></div>
          </div>

          {/* Mensaje */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Error interno del servidor
            </h2>
            <p className="text-secondary text-lg leading-relaxed">
              Ocurrió un error inesperado en nuestros servidores. Estamos trabajando para solucionarlo.
            </p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-emerald hover:bg-accent-teal text-background-dark font-semibold rounded-lg transition-all active:scale-[0.98]"
            >
              <FaRedo />
              Reintentar
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-panel border border-border hover:bg-accent-emerald/10 hover:border-accent-emerald text-foreground font-semibold rounded-lg transition-all active:scale-[0.98]"
            >
              <FaHome />
              Ir al inicio
            </Link>
          </div>

          {/* Info adicional */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-secondary leading-relaxed">
              Si el problema persiste, por favor{' '}
              <a
                href="https://github.com/anthropics/claude-code/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-emerald hover:underline"
              >
                reportalo en GitHub
              </a>
              {' '}o intentá más tarde.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

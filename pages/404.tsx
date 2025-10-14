import Link from 'next/link';
import { FaArrowLeft, FaHome, FaSearch } from 'react-icons/fa';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-7xl w-full text-center">
        {/* Card principal */}
        <div className="bg-panel border border-border rounded-2xl p-8 shadow-xl">
          {/* Número 404 */}
          <div className="mb-6">
            <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-accent-emerald to-accent-teal mx-auto rounded-full"></div>
          </div>

          {/* Mensaje */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Página no encontrada
            </h2>
            <p className="text-secondary text-lg leading-relaxed">
              La página que estás buscando no existe o fue movida a otra ubicación.
            </p>
          </div>

          {/* Ilustración decorativa */}
          <div className="mb-8 flex items-center justify-center gap-2 text-accent-emerald/30">
            <div className="w-16 h-1 bg-accent-emerald/30 rounded-full"></div>
            <FaSearch className="text-4xl" />
            <div className="w-16 h-1 bg-accent-emerald/30 rounded-full"></div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-emerald hover:bg-accent-teal text-background-dark font-semibold rounded-lg transition-all active:scale-[0.98]"
            >
              <FaHome />
              Ir al inicio
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-panel border border-border hover:bg-accent-emerald/10 hover:border-accent-emerald text-foreground font-semibold rounded-lg transition-all active:scale-[0.98]"
            >
              <FaArrowLeft />
              Volver atrás
            </button>
          </div>

          {/* Enlaces útiles */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-secondary mb-3">Enlaces útiles:</p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <Link
                href="/dashboard"
                className="text-accent-emerald hover:underline"
              >
                Dashboard
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/dashboard/calculadoras"
                className="text-accent-emerald hover:underline"
              >
                Calculadoras
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/dashboard/favoritos"
                className="text-accent-emerald hover:underline"
              >
                Favoritos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * LegalLayout - Layout compartido para páginas legales
 *
 * Características:
 * - Navegación entre secciones legales
 * - Tabla de contenidos
 * - Fecha de última actualización
 * - Diseño accesible y legible
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaFileContract,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCookie,
} from 'react-icons/fa';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
  tableOfContents?: Array<{ id: string; title: string }>;
}

const legalPages = [
  { href: '/terminos', label: 'Términos de Uso', icon: FaFileContract },
  { href: '/privacidad', label: 'Privacidad', icon: FaShieldAlt },
  { href: '/disclaimer', label: 'Disclaimer', icon: FaExclamationTriangle },
  { href: '/cookies', label: 'Cookies', icon: FaCookie },
];

export function LegalLayout({ children, title, lastUpdated, tableOfContents }: LegalLayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-white/10 bg-panel">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-brand transition-colors"
          >
            <FaHome className="text-xs" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Navegación Legal */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Legal Navigation */}
              <div>
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                  Información Legal
                </h3>
                <nav className="space-y-1">
                  {legalPages.map((page) => {
                    const Icon = page.icon;
                    const isActive = currentPath === page.href;
                    return (
                      <Link
                        key={page.href}
                        href={page.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-brand/10 text-brand font-medium'
                            : 'text-secondary hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`text-sm ${isActive ? 'text-brand' : 'text-secondary'}`} />
                        {page.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Table of Contents (si existe) */}
              {tableOfContents && tableOfContents.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                    En esta página
                  </h3>
                  <nav className="space-y-1">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block px-3 py-1.5 text-sm text-secondary hover:text-brand transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">{title}</h1>
                <p className="text-sm text-secondary">
                  Última actualización: <span className="text-foreground">{lastUpdated}</span>
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="bg-panel rounded-xl p-6 md:p-8 border border-white/10">
                  {children}
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8 p-4 bg-brand/5 border border-brand/20 rounded-lg">
                <p className="text-sm text-secondary">
                  Si tenés preguntas sobre estos términos, podés contactarnos en{' '}
                  <a href="mailto:legal@dolargaucho.com" className="text-brand hover:underline">
                    legal@dolargaucho.com
                  </a>
                </p>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

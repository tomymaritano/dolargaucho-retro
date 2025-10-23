import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaHome, FaSearch } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Custom404() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-background to-brand/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,213,154,0.08),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="glass-strong border border-white/10 rounded-3xl p-12 shadow-2xl">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            {mounted && (
              <Image
                src={isDark ? '/logo.svg' : '/logo-light.svg'}
                width={80}
                height={80}
                alt="Dólar Gaucho"
                className="drop-shadow-xl"
              />
            )}
          </motion.div>

          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="mb-6"
          >
            <h1 className="text-9xl md:text-[12rem] font-black gradient-text mb-4 leading-none">
              404
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-brand to-brand-light mx-auto rounded-full" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Página no encontrada
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-secondary text-lg mb-8 max-w-md mx-auto leading-relaxed"
          >
            La página que estás buscando no existe o fue movida. Probá volviendo al inicio o usando
            el dashboard.
          </motion.p>

          {/* Decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="mb-8 flex items-center justify-center gap-2 text-brand/30"
          >
            <div className="w-16 h-1 bg-brand/30 rounded-full" />
            <FaSearch className="text-4xl" />
            <div className="w-16 h-1 bg-brand/30 rounded-full" />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand hover:bg-brand-light text-background-dark rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl active:scale-[0.98]"
            >
              <FaHome className="group-hover:scale-110 transition-transform" />
              Ir al Inicio
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 glass border border-white/10 hover:border-brand/40 text-foreground rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-[0.98]"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Volver Atrás
            </button>

            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 glass border border-white/10 hover:border-brand/40 text-foreground rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-[0.98]"
            >
              <FaSearch className="group-hover:scale-110 transition-transform" />
              Dashboard
            </Link>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-8 border-t border-white/5"
          >
            <p className="text-sm text-secondary mb-3">Enlaces útiles:</p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <Link
                href="/dashboard"
                className="text-brand hover:text-brand-light transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-white/20">•</span>
              <Link
                href="/dashboard/herramientas"
                className="text-brand hover:text-brand-light transition-colors"
              >
                Herramientas
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/help" className="text-brand hover:text-brand-light transition-colors">
                Ayuda
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/roadmap" className="text-brand hover:text-brand-light transition-colors">
                Roadmap
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

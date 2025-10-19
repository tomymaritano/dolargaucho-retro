'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaGithub, FaTwitter, FaLinkedin, FaSearch } from 'react-icons/fa';
import AvisoLegal from './AvisoLegal';
import { ThemeToggle } from './ui/ThemeToggle/ThemeToggle';
import { GlobalSearch } from './ui/GlobalSearch/GlobalSearch';

interface SocialItem {
  label: string;
  icon: React.ReactElement;
  href: string;
}

const socialItems: SocialItem[] = [
  {
    label: 'GitHub',
    icon: <FaGithub />,
    href: 'https://github.com/tomymaritano',
  },
  {
    label: 'Twitter',
    icon: <FaTwitter />,
    href: 'https://twitter.com/hacklabdog',
  },
  {
    label: 'LinkedIn',
    icon: <FaLinkedin />,
    href: 'https://linkedin.com/in/tomymaritano',
  },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const toggleLegalPopup = () => {
    setIsLegalOpen(!isLegalOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-strong backdrop-blur-xl"
      >
        <div className="mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group z-50">
              <div className="relative">
                <Image
                  src="/logo.svg"
                  width={40}
                  height={40}
                  alt="Dolar Gaucho"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
                <div className="absolute -inset-2 bg-brand/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-lg sm:text-xl gradient-text">
                  Dólar Gaucho
                </div>
                <div className="text-[10px] text-secondary uppercase tracking-wider">Pro</div>
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle - Desktop only */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg glass hover:bg-white/5 transition-colors text-secondary hover:text-brand"
                aria-label="Buscar"
              >
                <FaSearch className="text-lg" />
              </button>

              {/* Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 rounded-lg glass hover:bg-white/5 transition-colors text-foreground z-50"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile/Desktop Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60]"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            />

            {/* Menu - Fullscreen en mobile, Sidebar en desktop */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-full md:w-80 md:max-w-[85vw] glass-strong flex flex-col overflow-hidden bg-background"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Image src="/logo.svg" width={48} height={48} alt="Dolar Gaucho" />
                    <div>
                      <div className="font-display font-bold text-xl gradient-text">
                        Dólar Gaucho
                      </div>
                      <div className="text-xs text-secondary uppercase tracking-wider">
                        Dashboard Profesional
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg glass hover:bg-white/5 transition-colors text-foreground"
                    aria-label="Cerrar menú"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Menu Content */}
              <nav className="flex-1 overflow-y-auto py-4 px-6 custom-scrollbar">
                <div className="space-y-4">
                  {/* Aviso Legal */}
                  <button
                    onClick={toggleLegalPopup}
                    className="w-full text-left px-4 py-3 rounded-lg glass hover:bg-white/5 transition-colors text-secondary hover:text-brand font-medium"
                  >
                    Aviso Legal
                  </button>

                  {/* Social Links */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-secondary uppercase mb-3">Síguenos</p>
                    <div className="flex gap-4">
                      {socialItems.map((social) => (
                        <a
                          key={social.href}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg glass hover:bg-white/5 transition-colors text-secondary hover:text-brand"
                          aria-label={social.label}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Theme Toggle en mobile */}
                  <div className="md:hidden pt-4 border-t border-border">
                    <p className="text-xs text-secondary uppercase mb-3">Tema</p>
                    <ThemeToggle />
                  </div>

                  {/* Auth Links */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand text-background-dark font-medium hover:bg-brand-light transition-all"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-brand text-brand font-medium hover:bg-brand/10 transition-all"
                    >
                      Crear Cuenta
                    </Link>
                  </div>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {isLegalOpen && <AvisoLegal onClose={() => setIsLegalOpen(false)} />}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin: 4px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 71, 255, 0.4);
          border-radius: 12px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 71, 255, 0.6);
        }
      `}</style>
    </>
  );
};

export default Navbar;

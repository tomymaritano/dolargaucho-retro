import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleLegalPopup = () => {
    setIsLegalOpen(!isLegalOpen);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-strong border-b border-accent-emerald/20 shadow-lg'
          : 'bg-dark/60 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image src="/logo.svg" width={36} height={36} alt="Dolar Gaucho" />
            <div className="absolute -inset-1 bg-accent-emerald/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </div>
          <div className="hidden md:block">
            <div className="font-display font-bold text-base gradient-text">Dólar Gaucho</div>
            <div className="text-[10px] text-secondary uppercase tracking-wider">Pro</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/5 transition-all text-secondary hover:text-accent-emerald"
            aria-label="Abrir búsqueda"
          >
            <FaSearch className="text-sm" />
            <span className="text-sm font-medium">Buscar</span>
            <kbd className="hidden lg:inline-block px-2 py-1 text-xs bg-background/50 border border-border rounded">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={toggleLegalPopup}
            className="text-sm text-secondary hover:text-accent-emerald transition-colors font-medium whitespace-nowrap"
          >
            Aviso Legal
          </button>

          <div className="flex items-center gap-3 border-l border-border pl-4">
            {socialItems.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-accent-emerald transition-colors text-lg"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <ThemeToggle />
        </div>

        <button
          className="md:hidden text-foreground text-xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-strong border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              <button
                onClick={toggleLegalPopup}
                className="text-sm text-secondary hover:text-accent-emerald transition-colors w-full text-left"
              >
                Aviso Legal
              </button>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex gap-6">
                  {socialItems.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl text-secondary hover:text-accent-emerald transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLegalOpen && <AvisoLegal onClose={() => setIsLegalOpen(false)} />}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;

'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Evitar mismatch hydration
  if (!mounted) {
    return <div className="w-10 h-10 rounded-lg glass animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="h-10 w-10 flex items-center justify-center rounded-lg glass hover:bg-white/5 transition-colors text-secondary hover:text-accent-emerald"
      aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
      title={`Modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      {theme === 'dark' ? (
        <FaSun className="text-lg text-accent-gold" />
      ) : (
        <FaMoon className="text-lg text-accent-indigo" />
      )}
    </button>
  );
}

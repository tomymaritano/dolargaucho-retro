'use client';

import { useTheme } from '@/lib/contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Evitar mismatch hydration
  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-background-secondary/50 animate-pulse" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full hover:bg-background-secondary/50 transition-all duration-200 group"
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      title={`Modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      {isDark ? (
        <FaMoon className="text-base text-indigo-400 group-hover:text-indigo-300 transition-colors" />
      ) : (
        <FaSun className="text-base text-yellow-500 group-hover:text-yellow-400 transition-colors" />
      )}
    </button>
  );
}

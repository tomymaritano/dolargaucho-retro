import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          DEFAULT: 'var(--background)',
          light: '#FFFFFF',
          dark: '#0A0E27',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          light: '#1A1A1A',
          dark: '#F8F9FA',
        },

        // Panel/Card backgrounds
        panel: {
          DEFAULT: 'var(--panel)',
          light: '#F9FAFB',
          dark: '#1A1F3A',
        },
        'panel-hover': {
          light: '#F3F4F6',
          dark: '#12172E',
        },

        // Legacy support (mantener por compatibilidad)
        dark: {
          DEFAULT: '#0A0E27',
          light: '#12172E',
          lighter: '#1A1F3A',
        },

        // Text colors
        primary: {
          DEFAULT: 'var(--text-primary)',
          light: '#111827',
          dark: '#F8F9FA',
        },
        secondary: {
          DEFAULT: 'var(--text-secondary)',
          light: '#6B7280',
          dark: '#9CA3AF',
        },

        // Borders
        border: {
          DEFAULT: 'var(--border)',
          light: '#E5E7EB',
          dark: 'rgba(255, 255, 255, 0.1)',
        },
        accent: {
          emerald: '#10B981',
          teal: '#14B8A6',
          blue: '#3B82F6',
          indigo: '#6366F1',
          slate: '#64748B',
          gold: '#F59E0B',
        },
        // Semantic colors
        success: {
          DEFAULT: '#10B981',
          light: '#059669',
          dark: '#34D399',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#DC2626',
          dark: '#F87171',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#D97706',
          dark: '#FBBF24',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#2563EB',
          dark: '#60A5FA',
        },

        // Glass effect
        glass: {
          light: 'rgba(0, 0, 0, 0.05)',
          dark: 'rgba(255, 255, 255, 0.05)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        glow: '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        gradient: 'gradient 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '200': '200% 200%',
      },
    },
  },
  plugins: [],
} satisfies Config;

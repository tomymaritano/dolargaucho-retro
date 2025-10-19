import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

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
        // BingX-inspired Color System
        // Primary brand colors (BingX Blue)
        brand: {
          DEFAULT: '#0047FF', // BingX Blue Ribbon - Primary action color
          light: '#3366FF', // Lighter variant for hover states
          dark: '#0036CC', // Darker variant for active states
          50: '#E6EEFF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0047FF', // Main brand color
          600: '#0036CC',
          700: '#002999',
          800: '#001C66',
          900: '#000F33',
        },

        // Secondary color (BingX Blue Violet)
        secondary: {
          DEFAULT: 'var(--text-secondary)',
          brand: '#5056A9', // BingX Blue Violet
          light: '#6B7280',
          dark: '#9CA3AF',
        },

        // Background colors
        background: {
          DEFAULT: 'var(--background)',
          light: '#FFFFFF', // Pure white for light mode
          'light-secondary': '#F8FAFC', // Subtle gray for light mode
          dark: '#0B0E1A', // Deep blue-black for dark mode (BingX inspired)
          'dark-secondary': '#14182B', // Slightly lighter dark
        },

        // Foreground/Text colors
        foreground: {
          DEFAULT: 'var(--foreground)',
          light: '#0F172A', // Almost black for light mode text
          'light-secondary': '#475569', // Gray text for light mode
          dark: '#F8FAFC', // Almost white for dark mode text
          'dark-secondary': '#94A3B8', // Gray text for dark mode
        },

        // Panel/Card backgrounds
        panel: {
          DEFAULT: 'var(--panel)',
          light: '#F8FAFC', // Very light gray-blue for light mode
          'light-elevated': '#FFFFFF', // White cards on light mode
          dark: '#14182B', // Dark blue-gray for dark mode
          'dark-elevated': '#1E2337', // Elevated cards in dark mode
        },

        'panel-hover': {
          light: '#F1F5F9',
          dark: '#1E2337',
        },

        // Borders
        border: {
          DEFAULT: 'var(--border)',
          light: '#E2E8F0',
          'light-strong': '#CBD5E1',
          dark: 'rgba(80, 86, 169, 0.15)', // BingX Blue Violet with opacity
          'dark-strong': 'rgba(80, 86, 169, 0.3)',
        },

        // Accent colors (ejecutivo y profesional)
        accent: {
          // Primary: BingX blue
          blue: '#0047FF',
          'blue-light': '#3366FF',
          // Secondary: BingX violet
          violet: '#5056A9',
          // Success: Professional green (finance)
          emerald: '#10B981',
          // Warning: Gold
          gold: '#F59E0B',
          // Info: Sky blue
          sky: '#0EA5E9',
          // Neutral
          slate: '#64748B',
        },

        // Semantic colors (profesional y ejecutivo)
        success: {
          DEFAULT: '#10B981',
          light: '#059669',
          dark: '#34D399',
          bg: {
            light: '#ECFDF5',
            dark: 'rgba(16, 185, 129, 0.1)',
          },
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#DC2626',
          dark: '#F87171',
          bg: {
            light: '#FEF2F2',
            dark: 'rgba(239, 68, 68, 0.1)',
          },
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#D97706',
          dark: '#FBBF24',
          bg: {
            light: '#FFFBEB',
            dark: 'rgba(245, 158, 11, 0.1)',
          },
        },
        info: {
          DEFAULT: '#0EA5E9',
          light: '#0284C7',
          dark: '#38BDF8',
          bg: {
            light: '#F0F9FF',
            dark: 'rgba(14, 165, 233, 0.1)',
          },
        },

        // Glass effect
        glass: {
          light: 'rgba(0, 71, 255, 0.03)', // BingX blue tint
          dark: 'rgba(80, 86, 169, 0.08)',
        },

        // Legacy support (mantener por compatibilidad con componentes existentes)
        dark: {
          DEFAULT: '#0B0E1A',
          light: '#14182B',
          lighter: '#1E2337',
        },
        primary: {
          DEFAULT: 'var(--text-primary)',
          light: '#0F172A',
          dark: '#F8FAFC',
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
      maxWidth: {
        '8xl': '88rem', // 1408px
        '9xl': '96rem', // 1536px
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
      borderWidth: {
        '3': '3px',
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
        'star-glow': 'starGlow 0.6s ease-out',
        marquee: 'marquee 25s linear infinite',
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
        starGlow: {
          '0%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 0 rgba(16, 185, 129, 0))' },
          '50%': {
            transform: 'scale(1.3)',
            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))',
          },
          '100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 0 rgba(16, 185, 129, 0))' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundSize: {
        '200': '200% 200%',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false, // Disable daisyUI themes to use our custom theme
    darkTheme: 'dark',
    base: false, // DISABLED - Don't apply base styles (was overriding custom styles)
    styled: false, // DISABLED - Don't apply default component styles (was overriding custom buttons/borders)
    utils: true, // Keep utility classes only (for breadcrumbs)
    prefix: '',
    logs: false,
  },
} satisfies Config;

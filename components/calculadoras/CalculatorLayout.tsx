import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/Card/Card';

interface CalculatorLayoutProps {
  title?: ReactNode;
  description?: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  showHeader?: boolean;
  /**
   * Layout variant:
   * - 'default': Traditional centered card layout (legacy)
   * - 'sidebar': Sidebar + results area layout (compact, professional)
   */
  variant?: 'default' | 'sidebar';
  /**
   * Sidebar content (only used when variant='sidebar')
   */
  sidebar?: ReactNode;
}

export const CalculatorLayout = React.memo(function CalculatorLayout({
  title,
  description,
  children,
  maxWidth = 'full',
  showHeader = true,
  variant = 'default',
  sidebar,
}: CalculatorLayoutProps) {
  const maxWidthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  // Sidebar layout: No card wrapper, grid layout
  if (variant === 'sidebar') {
    return (
      <div className={`mx-auto text-foreground ${maxWidthClasses[maxWidth]}`}>
        {/* Compact header for sidebar layout */}
        {showHeader && title && description && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-1">{title}</h2>
            <p className="text-secondary text-xs">{description}</p>
          </div>
        )}

        {/* Sidebar + Results Grid */}
        <div className="flex gap-0 rounded-xl overflow-hidden bg-panel">
          {/* Sidebar */}
          {sidebar && <>{sidebar}</>}

          {/* Results Area */}
          <div className="flex-1 p-4 bg-background-dark/30">{children}</div>
        </div>
      </div>
    );
  }

  // Default legacy layout: Centered card
  return (
    <div className={`mx-auto text-foreground ${maxWidthClasses[maxWidth]}`}>
      {/* Header */}
      {showHeader && title && description && (
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-secondary text-sm max-w-2xl mx-auto">{description}</p>
        </div>
      )}

      {/* Main Content - Using Card component */}
      <Card
        variant="elevated"
        padding="lg"
        className="border border-border/5 hover:border-brand/40 transition-all duration-300"
      >
        {children}
      </Card>
    </div>
  );
});

interface CalculatorInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'date';
  prefix?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  className?: string;
}

export const CalculatorInput = React.memo(function CalculatorInput({
  label,
  value,
  onChange,
  type = 'number',
  prefix,
  placeholder,
  min,
  max,
  className = '',
}: CalculatorInputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`w-full ${prefix ? 'pl-16' : 'px-4'} pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border/5 rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground`}
        />
      </div>
    </div>
  );
});

interface CalculatorResultCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export const CalculatorResultCard = React.memo(function CalculatorResultCard({
  label,
  value,
  sublabel,
  variant = 'success',
}: CalculatorResultCardProps) {
  const variantStyles = {
    success: 'bg-success/10 border-success/20 hover:border-success/40',
    error: 'bg-error/10 border-error/20 hover:border-error/40',
    warning: 'bg-warning/10 border-warning/20 hover:border-warning/40',
    info: 'bg-brand/10 border-brand/20 hover:border-brand/40',
  };

  const valueColors = {
    success: 'text-success',
    error: 'text-error',
    warning: 'text-warning',
    info: 'text-brand',
  };

  const gradientColors = {
    success: 'from-success/0 via-success/0 to-success/5',
    error: 'from-error/0 via-error/0 to-error/5',
    warning: 'from-warning/0 via-warning/0 to-warning/5',
    info: 'from-brand/0 via-brand/0 to-brand/5',
  };

  return (
    <Card
      variant="solid"
      padding="md"
      className={`group relative border ${variantStyles[variant]} hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-pointer`}
    >
      {/* Professional gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientColors[variant]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-wider text-secondary mb-1 font-medium group-hover:text-foreground/80 transition-colors duration-300">
          {label}
        </p>
        <p
          className={`text-3xl md:text-4xl font-bold font-mono ${valueColors[variant]} group-hover:scale-105 transition-transform duration-300`}
        >
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-secondary mt-2 group-hover:text-foreground/70 transition-colors duration-300">
            {sublabel}
          </p>
        )}
      </div>

      {/* Subtle shine effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr from-transparent via-${variant === 'info' ? 'brand' : variant}/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`}
      />
    </Card>
  );
});

interface CalculatorModeToggleProps {
  modes: { label: string; value: string }[];
  activeMode: string;
  onModeChange: (mode: string) => void;
}

export const CalculatorModeToggle = React.memo(function CalculatorModeToggle({
  modes,
  activeMode,
  onModeChange,
}: CalculatorModeToggleProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-4">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onModeChange(mode.value)}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 border ${
            activeMode === mode.value
              ? 'bg-brand text-background-dark border-brand scale-[1.02]'
              : 'bg-panel border-border/10 text-secondary hover:text-foreground hover:border-brand/30 hover:scale-[1.02] active:scale-95'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
});

interface CalculatorInfoBannerProps {
  title: string;
  subtitle?: string;
  value: string | number;
  loading?: boolean;
}

export const CalculatorInfoBanner = React.memo(function CalculatorInfoBanner({
  title,
  subtitle,
  value,
  loading = false,
}: CalculatorInfoBannerProps) {
  if (loading) {
    return (
      <Card variant="solid" padding="md" className="mb-6 text-center border border-border/5">
        <p className="text-sm text-secondary">Cargando datos...</p>
      </Card>
    );
  }

  return (
    <Card
      variant="solid"
      padding="md"
      className="group mb-6 border border-brand/20 bg-brand/5 hover:bg-brand/10 hover:border-brand/40 transition-all duration-300 relative overflow-hidden"
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/0 to-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-secondary mb-1 font-medium group-hover:text-brand-light/80 transition-colors duration-300">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-secondary/80 group-hover:text-brand-light/60 transition-colors duration-300">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-3xl md:text-4xl font-bold font-mono text-brand group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
});

interface CalculatorChartContainerProps {
  title?: string;
  children: ReactNode;
  height?: string;
}

export const CalculatorChartContainer = React.memo(function CalculatorChartContainer({
  title,
  children,
  height = 'h-80',
}: CalculatorChartContainerProps) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      className="border border-border/5 hover:border-brand/40 transition-all duration-300"
    >
      {title && <h3 className="text-sm font-semibold text-foreground mb-6">{title}</h3>}
      <div className={height}>{children}</div>
    </Card>
  );
});

import React, { ReactNode } from 'react';

interface CalculatorLayoutProps {
  title?: ReactNode;
  description?: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  showHeader?: boolean;
}

export function CalculatorLayout({
  title,
  description,
  children,
  maxWidth = '6xl',
  showHeader = true,
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

  return (
    <div className={`mx-auto text-foreground ${maxWidthClasses[maxWidth]}`}>
      {/* Header */}
      {showHeader && title && description && (
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">{title}</h2>
          <p className="text-secondary text-base max-w-7xl mx-auto">{description}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="glass-strong p-8 rounded-2xl border border-border">{children}</div>
    </div>
  );
}

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

export function CalculatorInput({
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
          className={`w-full ${prefix ? 'pl-16' : 'px-4'} pr-4 py-3 text-xl font-mono font-bold bg-panel border border-border rounded-xl focus:ring-2 focus:ring-brand/20 focus:border-brand/50 focus:outline-none transition-all text-foreground`}
        />
      </div>
    </div>
  );
}

interface CalculatorResultCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

export function CalculatorResultCard({
  label,
  value,
  sublabel,
  variant = 'success',
}: CalculatorResultCardProps) {
  const variantStyles = {
    success: 'bg-brand/5 border-brand/20 text-brand',
    error: 'bg-error/5 border-error/20 text-error',
    warning: 'bg-warning/5 border-warning/20 text-warning',
    info: 'bg-brand-light/5 border-brand-light/20 text-brand-light',
  };

  return (
    <div className={`p-6 rounded-xl border ${variantStyles[variant]}`}>
      <p className="text-xs uppercase tracking-wider text-secondary mb-2">{label}</p>
      <p className={`text-4xl font-bold font-mono ${variantStyles[variant].split(' ')[2]}`}>
        {value}
      </p>
      {sublabel && <p className="text-xs text-secondary mt-2">{sublabel}</p>}
    </div>
  );
}

interface CalculatorModeToggleProps {
  modes: { label: string; value: string }[];
  activeMode: string;
  onModeChange: (mode: string) => void;
}

export function CalculatorModeToggle({
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
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all border ${
            activeMode === mode.value
              ? 'bg-brand text-background-dark border-brand'
              : 'glass border-border text-secondary hover:text-foreground hover:border-brand/30'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

interface CalculatorInfoBannerProps {
  title: string;
  subtitle?: string;
  value: string | number;
  loading?: boolean;
}

export function CalculatorInfoBanner({
  title,
  subtitle,
  value,
  loading = false,
}: CalculatorInfoBannerProps) {
  if (loading) {
    return (
      <div className="mb-8 text-center p-4 glass rounded-xl border border-border">
        <p className="text-sm text-secondary">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="mb-8 p-5 rounded-xl border border-brand/20 bg-brand/5 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-secondary mb-1">{title}</p>
        {subtitle && <p className="text-sm text-secondary">{subtitle}</p>}
      </div>
      <div className="text-right">
        <p className="text-4xl font-bold font-mono text-brand">{value}</p>
      </div>
    </div>
  );
}

interface CalculatorChartContainerProps {
  title?: string;
  children: ReactNode;
  height?: string;
}

export function CalculatorChartContainer({
  title,
  children,
  height = 'h-80',
}: CalculatorChartContainerProps) {
  return (
    <div className="p-6 rounded-xl bg-panel/50 border border-border">
      {title && <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>}
      <div className={height}>{children}</div>
    </div>
  );
}

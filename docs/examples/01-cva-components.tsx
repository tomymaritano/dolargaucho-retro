/**
 * EJEMPLO: Componentes con CVA (Class Variance Authority)
 *
 * Este archivo muestra cómo crear componentes reutilizables y type-safe
 * usando CVA para manejar variantes de estilos.
 *
 * Instalación requerida:
 * npm install class-variance-authority clsx tailwind-merge
 */

import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// UTILITY: cn() - Merge Tailwind classes
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

const buttonVariants = cva(
  // Base styles (siempre se aplican)
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      // Variante de estilo
      variant: {
        primary: 'bg-brand text-dark hover:bg-brand-light focus:ring-brand',
        secondary: 'glass border border-border/5 text-white hover:bg-panel/20 focus:ring-white',
        outline: 'border-2 border-brand text-brand hover:bg-brand/10 focus:ring-brand',
        ghost: 'text-brand hover:bg-brand/10',
        danger: 'bg-error text-white hover:bg-error/90 focus:ring-error',
      },
      // Tamaño
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
        xl: 'px-8 py-5 text-xl',
      },
      // Ancho completo
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    // Valores por defecto
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

// Ejemplos de uso:
// <Button variant="primary" size="lg">Guardar</Button>
// <Button variant="outline" size="sm" isLoading>Cargando...</Button>
// <Button variant="danger" fullWidth>Eliminar</Button>

// ============================================================================
// CARD COMPONENT
// ============================================================================

const cardVariants = cva('rounded-xl transition-all', {
  variants: {
    variant: {
      default: 'glass-strong border border-border/5',
      outlined: 'border-2 border-brand/20 bg-transparent',
      elevated: 'glass-strong shadow-2xl border border-border/10',
      solid: 'bg-dark-light border border-border/5',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    },
    hover: {
      none: '',
      scale: 'hover:scale-[1.02]',
      glow: 'hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10',
      lift: 'hover:-translate-y-1 hover:shadow-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    hover: 'none',
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ variant, padding, hover, className, children }: CardProps) {
  return <div className={cn(cardVariants({ variant, padding, hover, className }))}>{children}</div>;
}

// Compound Components para Card
Card.Header = function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

Card.Title = function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h3 className={cn('text-xl font-bold', className)}>{children}</h3>;
};

Card.Description = function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn('text-sm text-secondary', className)}>{children}</p>;
};

Card.Content = function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('', className)}>{children}</div>;
};

Card.Footer = function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mt-4 pt-4 border-t border-border/10', className)}>{children}</div>;
};

// Ejemplo de uso:
/*
<Card variant="elevated" padding="lg" hover="glow">
  <Card.Header>
    <Card.Title>Dólar Blue</Card.Title>
    <Card.Description>Cotización del mercado paralelo</Card.Description>
  </Card.Header>
  <Card.Content>
    <p className="text-3xl font-mono text-brand">$1,250</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="outline" size="sm">Ver histórico</Button>
  </Card.Footer>
</Card>
*/

// ============================================================================
// BADGE COMPONENT
// ============================================================================

const badgeVariants = cva('inline-flex items-center rounded-full font-semibold', {
  variants: {
    variant: {
      default: 'bg-brand/10 text-brand border border-brand/20',
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      error: 'bg-error/10 text-error border border-error/20',
      info: 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20',
    },
    size: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, size, className, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))}>{children}</span>;
}

// Ejemplo de uso:
// <Badge variant="success">+5.2%</Badge>
// <Badge variant="error" size="sm">-2.1%</Badge>

// ============================================================================
// INPUT COMPONENT
// ============================================================================

const inputVariants = cva(
  'w-full rounded-lg border transition-all focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        default: 'border-border/5 bg-dark-light text-white focus:ring-brand focus:border-brand',
        outlined: 'border-brand/40 bg-transparent text-white focus:ring-brand focus:border-brand',
        error: 'border-error bg-error/5 text-white focus:ring-error focus:border-error',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-5 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  className,
  variant,
  size,
  label,
  error,
  helperText,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(inputVariants({ variant: error ? 'error' : variant, size, className }))}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-secondary">{helperText}</p>}
    </div>
  );
}

// Ejemplo de uso:
/*
<Input
  label="Monto en ARS"
  placeholder="Ingrese monto"
  type="number"
  helperText="Monto a convertir"
/>

<Input
  label="Email"
  type="email"
  error="Email inválido"
/>
*/

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const cardVariants = cva('rounded-xl transition-all', {
  variants: {
    variant: {
      default: 'glass-strong border border-white/5',
      outlined: 'border-2 border-accent-emerald/20 bg-transparent',
      elevated: 'glass-strong shadow-2xl border border-white/10',
      solid: 'bg-dark-light border border-white/5',
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
      glow: 'hover:border-accent-emerald/40 hover:shadow-lg hover:shadow-accent-emerald/10',
      lift: 'hover:-translate-y-1 hover:shadow-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    hover: 'none',
  },
});

export interface CardProps
  extends VariantProps<typeof cardVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ variant, padding, hover, className, children, ...rest }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding, hover, className }))} {...rest}>
      {children}
    </div>
  );
}

// Compound Components
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
  return <div className={cn('mt-4 pt-4 border-t border-white/10', className)}>{children}</div>;
};

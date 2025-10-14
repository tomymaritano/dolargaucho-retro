import { memo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const cardVariants = cva('rounded-xl transition-all', {
  variants: {
    variant: {
      default: 'glass-strong border border-border',
      outlined: 'border-2 border-accent-emerald/20 bg-transparent',
      elevated: 'glass-strong border border-border',
      solid: 'bg-panel border border-border',
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
      glow: 'hover:border-accent-emerald/40',
      lift: 'hover:-translate-y-1',
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

const CardComponent = memo(function Card({ variant, padding, hover, className, children, ...rest }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding, hover, className }))} {...rest}>
      {children}
    </div>
  );
});

// Compound Components
const CardHeader = function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

const CardTitle = function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h3 className={cn('text-xl font-bold', className)}>{children}</h3>;
};

const CardDescription = function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn('text-sm text-secondary', className)}>{children}</p>;
};

const CardContent = function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('', className)}>{children}</div>;
};

const CardFooter = function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mt-4 pt-4 border-t border-border', className)}>{children}</div>;
};

// Export Card with compound components attached
export const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

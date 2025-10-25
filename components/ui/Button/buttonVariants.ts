import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Linear-style Buttons
 *
 * Features:
 * - Subtle, refined aesthetic
 * - Soft borders and shadows
 * - Minimal hover effects
 * - Professional and clean
 */

export const buttonVariants = cva(
  // Base styles - always applied
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium',
    'rounded-lg',
    'transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-0',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'relative',
    'select-none',
  ],
  {
    variants: {
      variant: {
        // PRIMARY - Subtle solid with soft shadow
        primary: [
          'bg-brand',
          'text-white',
          'shadow-sm shadow-black/10',
          'hover:shadow hover:shadow-black/20',
          'hover:bg-brand/90',
          'active:scale-[0.99]',
        ],

        // SECONDARY - Subtle border with hover fill
        secondary: [
          'bg-transparent',
          'border border-border/10',
          'text-foreground',
          'hover:bg-white/5',
          'hover:border-white/20',
          'active:scale-[0.99]',
        ],

        // GHOST - Minimal, only hover background
        ghost: [
          'bg-transparent',
          'border border-transparent',
          'text-foreground',
          'hover:bg-foreground/5',
          'hover:border-foreground/10',
          'focus-visible:ring-foreground/30',
        ],

        // OUTLINE - Brand outline
        outline: [
          'bg-transparent',
          'border border-brand',
          'text-brand',
          'hover:bg-brand/5',
          'hover:-translate-y-0.5',
          'hover:shadow-sm hover:shadow-brand/10',
          'focus-visible:ring-brand',
          'active:translate-y-0',
        ],

        // DANGER - Solid red
        danger: [
          'bg-red-600',
          'text-white',
          'border border-red-600',
          'shadow-sm',
          'hover:bg-red-700',
          'hover:-translate-y-0.5',
          'hover:shadow-md hover:shadow-red-600/20',
          'focus-visible:ring-red-600',
          'active:translate-y-0',
        ],

        // LINK - Simple text link
        link: [
          'bg-transparent',
          'border-none',
          'text-brand',
          'hover:text-brand-light',
          'underline-offset-4',
          'hover:underline',
          'p-0',
          'shadow-none',
        ],
      },
      size: {
        xs: 'text-xs px-3 py-1.5 h-7',
        sm: 'text-sm px-4 py-2 h-9',
        md: 'text-base px-6 py-2.5 h-11',
        lg: 'text-lg px-8 py-3 h-12',
        xl: 'text-xl px-10 py-4 h-14',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

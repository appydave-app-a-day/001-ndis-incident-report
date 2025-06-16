import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-body font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default:
          'bg-deep-navy text-white hover:bg-primary hover:transform hover:-translate-y-px focus-visible:ring-4 focus-visible:ring-primary-blue/10 focus-visible:border-primary-blue',
        destructive:
          'bg-error-red text-white hover:bg-error-red/90 hover:transform hover:-translate-y-px focus-visible:ring-4 focus-visible:ring-error-red/10',
        outline:
          'border-2 border-border-light bg-transparent text-secondary-text hover:bg-light-background hover:border-border-medium focus-visible:ring-4 focus-visible:ring-primary-blue/10 focus-visible:border-primary-blue',
        secondary:
          'bg-transparent text-secondary-text border-2 border-border-light hover:bg-light-background hover:border-border-medium focus-visible:ring-4 focus-visible:ring-primary-blue/10',
        ghost:
          'hover:bg-light-background hover:text-primary-text',
        link: 'text-primary-blue underline-offset-4 hover:underline hover:text-primary-blue/80',
      },
      size: {
        default: 'px-6 py-3 has-[>svg]:px-5',
        sm: 'px-4 py-2 text-caption has-[>svg]:px-3',
        lg: 'px-8 py-4 text-lg has-[>svg]:px-6',
        icon: 'size-12 p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

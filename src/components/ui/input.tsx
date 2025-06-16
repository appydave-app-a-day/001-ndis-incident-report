import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'flex w-full rounded-md border-2 border-border-light bg-card-background px-4 py-4 text-body font-normal transition-all duration-200 outline-none',
        'placeholder:text-tertiary-text selection:bg-primary-blue selection:text-white',
        'focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10',
        'hover:border-border-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted',
        'aria-invalid:border-error-red aria-invalid:ring-4 aria-invalid:ring-error-red/10',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        className
      )}
      {...props}
    />
  );
}

export { Input };

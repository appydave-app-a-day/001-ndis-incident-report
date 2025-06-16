import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'flex w-full min-h-[120px] rounded-md border-2 border-border-light bg-card-background px-4 py-4 text-body font-normal transition-all duration-200 outline-none resize-vertical',
        'placeholder:text-tertiary-text selection:bg-primary-blue selection:text-white',
        'focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10',
        'hover:border-border-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted',
        'aria-invalid:border-error-red aria-invalid:ring-4 aria-invalid:ring-error-red/10',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };

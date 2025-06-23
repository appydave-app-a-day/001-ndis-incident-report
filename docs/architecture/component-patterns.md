# Component Patterns

## Overview

This document outlines reusable component patterns established during the development of the NDIS Incident Report application. These patterns promote consistency, maintainability, and rapid development.

## Core Patterns

### 1. Step Component Pattern

Used for all wizard steps with consistent structure:

```typescript
// Template for wizard step components
import React from 'react';
import { StepHeader } from '@/components/wizard/StepHeader';
import { useIncidentStore } from '@/store/useIncidentStore';
import { Card } from '@/components/ui/card';

interface StepProps {
  // Step-specific props
}

export const SomeStep: React.FC<StepProps> = () => {
  // Store selectors
  const data = useIncidentStore(state => state.data);
  const updateData = useIncidentStore(state => state.updateData);
  
  // Local state
  const [localState, setLocalState] = useState();
  
  // Handlers
  const handleChange = (field: string, value: any) => {
    updateData({ [field]: value });
  };
  
  return (
    <>
      <StepHeader
        title="Step Title"
        description="Step description for users"
      />
      
      <Card className="p-6">
        {/* Step content */}
      </Card>
    </>
  );
};
```

### 2. Form Field Pattern

Consistent form field structure with labels and error handling:

```typescript
// Reusable form field component
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'datetime-local';
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  type = 'text'
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};
```

### 3. Clarification Pattern

Reusable pattern for Q&A interfaces:

```typescript
// Base clarification component
interface ClarificationStepProps {
  phase: 'beforeEvent' | 'duringEvent' | 'endEvent' | 'postEvent';
  title: string;
  description: string;
}

export const ClarificationStep: React.FC<ClarificationStepProps> = ({
  phase,
  title,
  description
}) => {
  const questions = useIncidentStore(state => 
    state.clarificationQuestions?.[phase] || []
  );
  const answers = useIncidentStore(state => 
    state.report.clarificationAnswers[phase]
  );
  const updateAnswer = useIncidentStore(state => 
    state.updateClarificationAnswer
  );
  
  return (
    <>
      <StepHeader title={title} description={description} />
      
      <div className="space-y-6">
        {questions.map((question) => {
          const answer = answers.find(a => a.questionId === question.id);
          
          return (
            <Card key={question.id} className="p-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  {question.question}
                </Label>
                <Textarea
                  value={answer?.answer || ''}
                  onChange={(e) => updateAnswer(
                    phase,
                    question.id,
                    e.target.value
                  )}
                  placeholder="Your answer (optional)"
                  rows={3}
                />
              </div>
            </Card>
          );
        })}
        
        {questions.length === 0 && (
          <EmptyState message="No clarification questions available" />
        )}
      </div>
    </>
  );
};
```

### 4. Loading State Pattern

Consistent loading indicators across the app:

```typescript
// Loading wrapper component
interface LoadingWrapperProps {
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  error,
  onRetry,
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="large" />
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
      />
    );
  }
  
  return <>{children}</>;
};
```

### 5. Card Section Pattern

For organizing content in cards:

```typescript
interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  children,
  className = ''
}) => {
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
```

## Complex Component Patterns

### 1. Modal Dialog Pattern

Standard modal implementation:

```typescript
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>
        
        {actions && (
          <DialogFooter>
            {actions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
```

### 2. Data Display Pattern

For showing read-only data:

```typescript
interface DataFieldProps {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}

export const DataField: React.FC<DataFieldProps> = ({
  label,
  value,
  icon
}) => {
  return (
    <div className="py-2">
      <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">
        {value || <span className="text-gray-400">Not provided</span>}
      </dd>
    </div>
  );
};

// Usage
<dl className="space-y-2">
  <DataField 
    label="Reporter Name" 
    value={metadata.reporterName}
    icon={<UserIcon className="h-4 w-4" />}
  />
  <DataField 
    label="Event Date" 
    value={formatDate(metadata.eventDateTime)}
    icon={<CalendarIcon className="h-4 w-4" />}
  />
</dl>
```

### 3. Toggle Pattern

For binary choices:

```typescript
interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="space-y-0.5">
        <Label htmlFor={label}>{label}</Label>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
};
```

### 4. Status Indicator Pattern

For showing process status:

```typescript
type Status = 'pending' | 'loading' | 'complete' | 'error';

interface StatusIndicatorProps {
  status: Status;
  label: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label
}) => {
  const config = {
    pending: {
      icon: <MinusCircle className="h-5 w-5" />,
      color: 'text-gray-400',
      text: 'Pending'
    },
    loading: {
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      color: 'text-blue-500',
      text: 'Processing'
    },
    complete: {
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-500',
      text: 'Complete'
    },
    error: {
      icon: <XCircle className="h-5 w-5" />,
      color: 'text-red-500',
      text: 'Failed'
    }
  };
  
  const { icon, color, text } = config[status];
  
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      {icon}
      <span className="font-medium">{label}</span>
      <span className="text-sm">({text})</span>
    </div>
  );
};
```

## Composition Patterns

### 1. Layout Composition

```typescript
// Base layout for all pages
export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Wizard-specific layout
export const WizardLayout: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator />
        <div className="mt-8">
          {children}
        </div>
        <NavigationControls />
      </div>
    </PageLayout>
  );
};
```

### 2. Higher-Order Components

```typescript
// Add loading state to any component
export function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return (props: P & { isLoading?: boolean }) => {
    if (props.isLoading) {
      return <LoadingSpinner />;
    }
    return <Component {...props} />;
  };
}

// Add error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return class extends React.Component<P> {
    state = { hasError: false, error: null };
    
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }
    
    render() {
      if (this.state.hasError) {
        return <ErrorDisplay error={this.state.error} />;
      }
      return <Component {...this.props} />;
    }
  };
}
```

## Accessibility Patterns

### 1. Focus Management

```typescript
// Auto-focus first input in forms
export const AutoFocusForm: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    const firstInput = formRef.current?.querySelector(
      'input:not([disabled]), textarea:not([disabled])'
    );
    (firstInput as HTMLElement)?.focus();
  }, []);
  
  return <form ref={formRef}>{children}</form>;
};
```

### 2. Keyboard Navigation

```typescript
// Handle keyboard shortcuts
export const useKeyboardShortcuts = (shortcuts: Record<string, () => void>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.key}`;
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
```

## Testing Patterns

### 1. Component Testing

```typescript
// Test wrapper with providers
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <BrowserRouter>
      <WizardProvider>
        {children}
      </WizardProvider>
    </BrowserRouter>
  );
};

// Render with test wrapper
export const renderWithProviders = (component: React.ReactElement) => {
  return render(component, { wrapper: TestWrapper });
};
```

### 2. Mock Data Patterns

```typescript
// Factory functions for test data
export const createMockIncident = (
  overrides?: Partial<IncidentReport>
): IncidentReport => ({
  metadata: {
    reporterName: 'Test Reporter',
    participantName: 'Test Participant',
    eventDateTime: '2024-01-01T10:00',
    location: 'Test Location'
  },
  narrative: {
    beforeEvent: 'Test before narrative',
    duringEvent: 'Test during narrative',
    endEvent: 'Test end narrative',
    postEvent: 'Test post narrative'
  },
  ...overrides
});
```

## Performance Patterns

### 1. Memoization

```typescript
// Memoize expensive computations
export const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => 
    expensiveProcessing(data),
    [data]
  );
  
  return <div>{processedData}</div>;
});
```

### 2. Lazy Loading

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export const LazyWrapper = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <HeavyComponent />
  </Suspense>
);
```

## Anti-Patterns to Avoid

1. **Direct DOM Manipulation** - Use React state and refs
2. **Inline Styles** - Use Tailwind classes or CSS modules
3. **Anonymous Functions in Render** - Define handlers outside render
4. **Deeply Nested State** - Flatten or use proper state management
5. **Prop Drilling** - Use context or state management for deep props

## Conclusion

These patterns provide a foundation for consistent, maintainable component development. They should be adapted and extended based on specific feature requirements while maintaining the core principles of reusability, accessibility, and performance.
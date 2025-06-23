import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';

export interface ErrorDisplayProps {
  error: Error | string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = 'An error occurred',
  onRetry,
  className = '',
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorDetails = typeof error === 'object' && error.stack ? error.stack : undefined;

  return (
    <Alert variant="destructive" className={`${className}`}>
      <AlertCircle className="h-4 w-4" />
      <div className="font-medium">{title}</div>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p>{errorMessage}</p>
          {process.env.NODE_ENV === 'development' && errorDetails && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm opacity-70 hover:opacity-100">
                Show technical details
              </summary>
              <pre className="mt-2 text-xs overflow-auto p-2 bg-black/10 rounded">
                {errorDetails}
              </pre>
            </details>
          )}
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
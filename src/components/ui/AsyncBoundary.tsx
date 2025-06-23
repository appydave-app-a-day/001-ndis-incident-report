import React from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorDisplay } from './ErrorDisplay';

export interface AsyncBoundaryProps {
  loading?: boolean;
  error?: Error | string | null;
  loadingMessage?: string;
  errorTitle?: string;
  onRetry?: () => void;
  children: React.ReactNode;
  showChildrenWhileLoading?: boolean;
  className?: string;
}

export const AsyncBoundary: React.FC<AsyncBoundaryProps> = ({
  loading = false,
  error = null,
  loadingMessage = 'Loading...',
  errorTitle = 'An error occurred',
  onRetry,
  children,
  showChildrenWhileLoading = false,
  className = '',
}) => {
  // If there's an error, show the error display
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title={errorTitle}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  // If loading and not showing children while loading, show only the loading overlay
  if (loading && !showChildrenWhileLoading) {
    return <LoadingOverlay isOpen={true} message={loadingMessage} />;
  }

  // If loading and showing children while loading, render both
  if (loading && showChildrenWhileLoading) {
    return (
      <>
        {children}
        <LoadingOverlay isOpen={true} message={loadingMessage} />
      </>
    );
  }

  // No loading or error, just render children
  return <>{children}</>;
};
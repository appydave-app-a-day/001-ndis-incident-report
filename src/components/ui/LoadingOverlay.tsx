import { Loader2, AlertTriangle } from 'lucide-react';
import React, { useEffect } from 'react';

interface LoadingOverlayProps {
  isOpen: boolean;
  message: string;
  isError?: boolean;
  onAutoClose?: () => void;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isOpen,
  message,
  isError = false,
  onAutoClose,
}) => {
  // Auto-dismiss error messages after 3 seconds
  useEffect(() => {
    if (isOpen && isError && onAutoClose) {
      const timer = setTimeout(() => {
        onAutoClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isError, onAutoClose]);

  if (!isOpen) return null;

  return (
    <div className="consolidation-loading-overlay">
      <div className={`consolidation-loading-content ${isError ? 'error-state' : ''}`}>
        <div className="consolidation-spinner-container">
          {isError ? (
            <AlertTriangle className="consolidation-error-icon" />
          ) : (
            <Loader2 className="consolidation-spinner" />
          )}
        </div>
        <h3 className="consolidation-loading-title">
          {message}
        </h3>
        {isError && (
          <p className="consolidation-error-text">
            This message will automatically close in a few seconds.
          </p>
        )}
      </div>
    </div>
  );
};
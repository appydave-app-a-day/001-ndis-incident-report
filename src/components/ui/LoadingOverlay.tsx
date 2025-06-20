import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingOverlayProps {
  isOpen: boolean;
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isOpen,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="consolidation-loading-overlay">
      <div className="consolidation-loading-content">
        <div className="consolidation-spinner-container">
          <Loader2 className="consolidation-spinner" />
        </div>
        <h3 className="consolidation-loading-title">
          {message}
        </h3>
      </div>
    </div>
  );
};
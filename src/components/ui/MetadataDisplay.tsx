import React from 'react';

import type { IncidentMetadata } from '@/store/useIncidentStore';

interface MetadataDisplayProps {
  metadata: IncidentMetadata;
  className?: string;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({
  metadata,
  className = '',
}) => {
  // Format the date/time for display
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'Not specified';
    
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateTimeString; // Fallback to original string if parsing fails
    }
  };

  return (
    <div className={`metadata-display ${className}`}>
      <div className="metadata-header">
        <span>📋</span>
        <h3 className="metadata-title">Incident Details</h3>
      </div>
      
      <div className="metadata-grid">
        <div className="metadata-field">
          <span className="metadata-label">Reporter</span>
          <p className="metadata-value">
            {metadata.reporterName || 'Not specified'}
          </p>
        </div>

        <div className="metadata-field">
          <span className="metadata-label">Participant</span>
          <p className="metadata-value">
            {metadata.participantName || 'Not specified'}
          </p>
        </div>

        <div className="metadata-field">
          <span className="metadata-label">Date & Time</span>
          <p className="metadata-value">
            {formatDateTime(metadata.eventDateTime)}
          </p>
        </div>

        <div className="metadata-field">
          <span className="metadata-label">Location</span>
          <p className="metadata-value">
            {metadata.location || 'Not specified'}
          </p>
        </div>
      </div>
    </div>
  );
};
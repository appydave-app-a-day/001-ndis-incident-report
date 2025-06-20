import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
    <Card className={`metadata-display ${className}`}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">📋 Incident Details</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="metadata-field">
            <Label className="text-sm font-medium text-gray-600">Reporter</Label>
            <p className="text-base text-gray-900 mt-1">
              {metadata.reporterName || 'Not specified'}
            </p>
          </div>

          <div className="metadata-field">
            <Label className="text-sm font-medium text-gray-600">Participant</Label>
            <p className="text-base text-gray-900 mt-1">
              {metadata.participantName || 'Not specified'}
            </p>
          </div>

          <div className="metadata-field">
            <Label className="text-sm font-medium text-gray-600">Date & Time</Label>
            <p className="text-base text-gray-900 mt-1">
              {formatDateTime(metadata.eventDateTime)}
            </p>
          </div>

          <div className="metadata-field">
            <Label className="text-sm font-medium text-gray-600">Location</Label>
            <p className="text-base text-gray-900 mt-1">
              {metadata.location || 'Not specified'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
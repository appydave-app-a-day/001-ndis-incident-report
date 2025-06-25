import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface NarrativeDisplayProps {
  title?: string;
  content: string;
  className?: string;
  showTitle?: boolean;
}

/**
 * Reusable component for displaying narrative content in read-only format
 * Used across the analysis workflow for consistent narrative presentation
 */
export const NarrativeDisplay: React.FC<NarrativeDisplayProps> = ({
  title = 'Consolidated Incident Narrative',
  content,
  className = '',
  showTitle = true,
}) => {
  return (
    <Card className={`narrative-display ${className}`}>
      {showTitle && (
        <CardHeader className="pb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </CardHeader>
      )}
      <CardContent className="pt-0">
        <div className="narrative-content space-y-4">
          {content ? (
            content.split('\n\n').map((paragraph, index) => (
              <p 
                key={index} 
                className="text-gray-700 leading-relaxed text-sm"
              >
                {paragraph.trim()}
              </p>
            ))
          ) : (
            <p className="text-gray-500 italic text-sm">
              No narrative content available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NarrativeDisplay;
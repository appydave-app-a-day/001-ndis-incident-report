import React from 'react';
import { ExternalLink } from 'lucide-react';

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  onViewContent?: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  stepNumber,
  title,
  subtitle,
  icon,
  onViewContent,
}) => {
  return (
    <div className="step-header px-xxxl py-xxl bg-card-background border-b border-border-light relative">
      {onViewContent && (
        <button
          onClick={onViewContent}
          className="absolute top-xxl right-xxxl text-secondary-text text-caption flex items-center gap-2 hover:text-primary-blue transition-colors duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          View Content
        </button>
      )}
      
      <div className="step-icon w-14 h-14 bg-primary-blue rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-blue/30">
        {icon || (
          <span className="text-white text-xl font-bold">{stepNumber}</span>
        )}
      </div>
      
      <h1 className="text-main-title text-deep-navy font-bold mb-2 leading-tight">
        {title}
      </h1>
      
      <p className="text-subtitle text-secondary-text">
        {subtitle}
      </p>
    </div>
  );
};

export default StepHeader;
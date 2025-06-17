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
    <div className="step-header px-8 py-8 bg-white border-b border-gray-200 relative">
      {onViewContent && (
        <button
          onClick={onViewContent}
          className="absolute top-6 right-8 text-gray-500 text-sm flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          View Content
        </button>
      )}
      
      <div className="step-icon w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30">
        {icon || (
          <span className="text-white text-xl font-bold">{stepNumber}</span>
        )}
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
        {title}
      </h1>
      
      <p className="text-lg text-gray-600">
        {subtitle}
      </p>
    </div>
  );
};

export default StepHeader;
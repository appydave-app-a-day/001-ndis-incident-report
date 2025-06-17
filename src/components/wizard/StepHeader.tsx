import React from 'react';
import { Eye } from 'lucide-react';

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
    <div className="step-header-improved">
      {onViewContent && (
        <button
          onClick={onViewContent}
          className="debug-button z-10"
          title="View form data (debug)"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
      
      <div className="step-icon w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 relative z-10">
        {icon || (
          <span className="text-white text-xl font-bold">{stepNumber}</span>
        )}
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-3 leading-tight relative z-10">
        {title}
      </h1>
      
      <p className="text-xl text-white/90 relative z-10">
        {subtitle}
      </p>
    </div>
  );
};

export default StepHeader;
import { Eye } from 'lucide-react';
import React from 'react';

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  subtitle: string;
  onViewContent?: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  stepNumber: _stepNumber,
  title,
  subtitle,
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
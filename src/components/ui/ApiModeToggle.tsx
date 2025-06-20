import { Cloud, Database } from 'lucide-react';
import React from 'react';

import { useIncidentStore } from '@/store/useIncidentStore';

interface ApiModeToggleProps {
  className?: string;
}

export const ApiModeToggle: React.FC<ApiModeToggleProps> = ({
  className = '',
}) => {
  const { apiMode, toggleApiMode } = useIncidentStore();

  const isLiveMode = apiMode === 'live';

  const getTooltipText = () => {
    if (isLiveMode) {
      return 'Switch to Mock Mode (using sample data)';
    } else {
      return 'Switch to Live Mode (using N8N API)';
    }
  };

  const getDisplayText = () => {
    return isLiveMode ? 'Live' : 'Mock';
  };

  return (
    <button
      onClick={toggleApiMode}
      className={`debug-button z-10 ${className}`}
      title={getTooltipText()}
      style={{ right: '7rem' }}
    >
      {isLiveMode ? (
        <Cloud className="w-4 h-4" />
      ) : (
        <Database className="w-4 h-4" />
      )}
      <span className="ml-1 text-xs font-medium">
        {getDisplayText()}
      </span>
    </button>
  );
};
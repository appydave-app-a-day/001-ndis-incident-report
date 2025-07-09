import React from 'react';

import { Button } from '@/components/ui/button';
import { useToastHelpers } from '@/components/ui/toast';

/**
 * Test component to demonstrate API error handling and toast notifications
 * Remove this component after testing
 */
export const ApiErrorTestButton: React.FC = () => {
  const toast = useToastHelpers();

  const testCorsError = () => {
    toast.corsError('buildergeniobit.app.n8n.cloud');
  };

  const testAuthError = () => {
    toast.error('Authentication Failed', 'Please check your API key configuration');
  };

  const testApiError = () => {
    toast.apiError('generate-clarification-questions', 'Failed to fetch');
  };

  const testSuccess = () => {
    toast.success('API Connected', 'Successfully connected to N8N server');
  };

  // Feature flag for API error debugging - only show in dev mode AND when explicitly enabled
  const showApiDebug = import.meta.env.DEV && import.meta.env.VITE_SHOW_API_DEBUG === 'true';
  
  // Debug logging
  console.log('ApiErrorTestButton Debug:', {
    isDev: import.meta.env.DEV,
    showApiDebugVar: import.meta.env.VITE_SHOW_API_DEBUG,
    showApiDebug
  });
  
  if (!showApiDebug) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      padding: '16px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: '200px'
    }}>
      <h3 style={{ 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#374151', 
        margin: '0 0 8px 0' 
      }}>
        API Error Tests
      </h3>
      <Button variant="outline" size="sm" onClick={testCorsError}>
        Test CORS Error
      </Button>
      <Button variant="outline" size="sm" onClick={testAuthError}>
        Test Auth Error
      </Button>
      <Button variant="outline" size="sm" onClick={testApiError}>
        Test API Error
      </Button>
      <Button variant="outline" size="sm" onClick={testSuccess}>
        Test Success
      </Button>
    </div>
  );
};
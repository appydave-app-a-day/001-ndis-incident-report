import React from 'react';

import { Button } from './button';
import { useToast } from './toast';

export const SimpleToastTest: React.FC = () => {
  const { addToast } = useToast();

  const testBasicToast = () => {
    console.log('Testing basic toast...');
    addToast({
      type: 'success',
      title: 'Test Toast',
      description: 'This is a test toast notification',
      duration: 5000,
    });
  };

  const testErrorToast = () => {
    console.log('Testing error toast...');
    addToast({
      type: 'error',
      title: 'Error Test',
      description: 'This is an error test',
      duration: 5000,
    });
  };

  // Feature flag for toast debugging - only show in dev mode AND when explicitly enabled
  const showToastDebug = import.meta.env.DEV && import.meta.env.VITE_SHOW_TOAST_DEBUG === 'true';
  
  // Debug logging
  console.log('SimpleToastTest Debug:', {
    isDev: import.meta.env.DEV,
    showToastDebugVar: import.meta.env.VITE_SHOW_TOAST_DEBUG,
    showToastDebug
  });
  
  if (!showToastDebug) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
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
        Toast Debug
      </h3>
      <Button variant="outline" size="sm" onClick={testBasicToast}>
        Test Basic Toast
      </Button>
      <Button variant="outline" size="sm" onClick={testErrorToast}>
        Test Error Toast
      </Button>
    </div>
  );
};
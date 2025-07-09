/**
 * Toast notification utility for use outside of React components
 * This provides a way to show toast notifications from service layers
 */

// Global toast notification functions
let globalToastHelpers: {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  corsError: (domain: string) => void;
  apiError: (endpoint: string, error: string) => void;
} | null = null;

/**
 * Register toast helpers for global use
 * This should be called once in the app initialization
 */
export const registerToastHelpers = (toastHelpers: typeof globalToastHelpers) => {
  globalToastHelpers = toastHelpers;
};

/**
 * Show API error toast notifications
 */
export const showApiErrorToast = (endpoint: string, error: string, errorType?: string) => {
  if (!globalToastHelpers) {
    console.warn('Toast helpers not registered - cannot show toast notification');
    return;
  }

  // Show appropriate toast based on error type
  if (errorType === 'cors' || error.includes('CORS')) {
    globalToastHelpers.corsError(endpoint);
  } else if (errorType === 'auth' || error.includes('Authentication failed')) {
    globalToastHelpers.error('Authentication Error', 'Please check your API key configuration');
  } else if (errorType === 'timeout' || error.includes('timeout')) {
    globalToastHelpers.warning('Request Timeout', 'The server is taking too long to respond');
  } else if (errorType === 'not_found' || error.includes('404')) {
    globalToastHelpers.error('Endpoint Not Found', `The API endpoint ${endpoint} was not found`);
  } else if (errorType === 'server_error' || error.includes('500')) {
    globalToastHelpers.error('Server Error', 'An internal server error occurred. Please try again later.');
  } else {
    globalToastHelpers.error('API Connection Failed', `Unable to connect to ${endpoint}: ${error}`);
  }
};

/**
 * Show API fallback notification
 */
export const showApiFallbackToast = (reason: string) => {
  if (!globalToastHelpers) {
    console.warn('Toast helpers not registered - cannot show toast notification');
    return;
  }

  globalToastHelpers.warning(
    'Using Mock Data', 
    `Live API failed (${reason}). Falling back to mock data for testing.`
  );
};
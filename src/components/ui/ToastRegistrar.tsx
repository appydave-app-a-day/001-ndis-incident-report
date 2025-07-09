import { useEffect } from 'react';

import { registerToastHelpers } from '@/lib/utils/toast-notifications';

import { useToastHelpers } from './toast';

/**
 * Component that registers toast helpers for global use
 * This allows service layers to show toast notifications
 */
export const ToastRegistrar: React.FC = () => {
  const toastHelpers = useToastHelpers();

  useEffect(() => {
    registerToastHelpers(toastHelpers);
  }, [toastHelpers]);

  return null; // This component doesn't render anything
};
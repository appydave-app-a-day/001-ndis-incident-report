import { X } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Toast types and interfaces
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

// Toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast provider component
interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    console.log('Adding toast:', newToast);
    setToasts((prev) => {
      const updated = [...prev, newToast];
      console.log('Updated toasts:', updated);
      return updated;
    });

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
};

// Toast viewport (container for all toasts)
const ToastViewport: React.FC = () => {
  const { toasts } = useToast();

  console.log('ToastViewport render, toasts:', toasts);

  if (toasts.length === 0) {
    console.log('No toasts to display');
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      maxWidth: '400px',
      width: '100%'
    }}>
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

// Individual toast component
interface ToastComponentProps {
  toast: Toast;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => removeToast(toast.id), 150); // Wait for exit animation
  };

  const getToastStyles = () => {
    const baseStyle = {
      position: 'relative' as const,
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      marginBottom: '8px',
      borderRadius: '8px',
      border: '1px solid',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      minHeight: '60px'
    };
    
    switch (toast.type) {
      case 'success':
        return { ...baseStyle, backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' };
      case 'error':
        return { ...baseStyle, backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' };
      case 'warning':
        return { ...baseStyle, backgroundColor: '#fffbeb', borderColor: '#fed7aa', color: '#d97706' };
      case 'info':
        return { ...baseStyle, backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#2563eb' };
      default:
        return { ...baseStyle, backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#374151' };
    }
  };

  return (
    <div
      style={{
        ...getToastStyles(),
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {toast.title && (
          <div style={{ fontSize: '14px', fontWeight: '600' }}>{toast.title}</div>
        )}
        {toast.description && (
          <div style={{ fontSize: '14px', opacity: 0.9 }}>{toast.description}</div>
        )}
      </div>
      {toast.action}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          right: '8px',
          top: '8px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          color: '#6b7280',
          opacity: 0.7
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
      >
        <X style={{ width: '16px', height: '16px' }} />
        <span style={{ position: 'absolute', left: '-9999px' }}>Close</span>
      </button>
    </div>
  );
};

// Convenience hook for common toast patterns
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    
    error: (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    
    warning: (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    
    info: (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),

    apiError: (endpoint: string, error: string) =>
      addToast({
        type: 'error',
        title: 'API Connection Failed',
        description: `Unable to connect to ${endpoint}: ${error}`,
        duration: 8000, // Longer duration for API errors
      }),

    corsError: (domain: string) =>
      addToast({
        type: 'warning',
        title: 'Server Configuration Issue',
        description: `CORS policy is blocking requests to ${domain}. Please contact your administrator.`,
        duration: 10000,
      }),
  };
};
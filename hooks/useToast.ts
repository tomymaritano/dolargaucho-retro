import { useState, useCallback } from 'react';
import { ToastType } from '@/components/Toast';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
  duration?: number;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
    duration: 3000,
  });

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3000) => {
      setToast({ message, type, isVisible: true, duration });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};

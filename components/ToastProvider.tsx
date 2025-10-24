import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from 'react-icons/fa';
import { useToastStore } from '@/lib/store/toast-store';
import type { ToastType } from '@/lib/store/toast-store';

const ToastItem: React.FC<{
  id: string;
  message: string;
  type: ToastType;
  onClose: () => void;
}> = ({ id, message, type, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-brand text-xl" />;
      case 'error':
        return <FaExclamationCircle className="text-error text-xl" />;
      case 'warning':
        return <FaExclamationTriangle className="text-warning text-xl" />;
      case 'info':
        return <FaInfoCircle className="text-info text-xl" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-white/95 dark:bg-dark-light/95 border-brand/30';
      case 'error':
        return 'bg-white/95 dark:bg-dark-light/95 border-error/30';
      case 'warning':
        return 'bg-white/95 dark:bg-dark-light/95 border-warning/30';
      case 'info':
        return 'bg-white/95 dark:bg-dark-light/95 border-info/30';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <div
        className={`glass-strong ${getBgColor()} border rounded-lg shadow-xl p-4 flex items-center gap-3 backdrop-blur-xl`}
      >
        {getIcon()}
        <p className="text-gray-900 dark:text-white flex-1 font-medium text-sm">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-600 dark:text-secondary hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
          aria-label="Cerrar notificación"
        >
          <FaTimes />
        </button>
      </div>
    </motion.div>
  );
};

export const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem
              id={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

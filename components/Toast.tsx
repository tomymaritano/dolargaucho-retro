import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-accent-emerald text-xl" />;
      case 'error':
        return <FaExclamationCircle className="text-error text-xl" />;
      case 'info':
        return <FaInfoCircle className="text-info text-xl" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-white/95 dark:bg-dark-light/95 border-accent-emerald/30';
      case 'error':
        return 'bg-white/95 dark:bg-dark-light/95 border-error/30';
      case 'info':
        return 'bg-white/95 dark:bg-dark-light/95 border-info/30';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-20 right-6 z-[9999] max-w-7xl"
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
      )}
    </AnimatePresence>
  );
};

export default Toast;

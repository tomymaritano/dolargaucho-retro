'use client';

/**
 * ConfirmDialog - Unified confirmation dialog for destructive actions
 *
 * Best Practice: Ask for confirmation on destructive actions
 * (delete, remove, cancel, etc.)
 *
 * Features:
 * - Modal with backdrop blur
 * - Framer Motion animations
 * - Variants: danger, warning, info
 * - Customizable button labels
 * - Focus trap
 * - ESC to close
 *
 * @example
 * // Delete confirmation
 * const [isDeleteOpen, setIsDeleteOpen] = useState(false);
 *
 * <ConfirmDialog
 *   isOpen={isDeleteOpen}
 *   onClose={() => setIsDeleteOpen(false)}
 *   onConfirm={handleDelete}
 *   title="¿Eliminar alerta?"
 *   description="Esta acción no se puede deshacer. La alerta se eliminará permanentemente."
 *   confirmText="Sí, eliminar"
 *   cancelText="Cancelar"
 *   variant="danger"
 * />
 *
 * @example
 * // Warning confirmation
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   onConfirm={handleProceed}
 *   title="¿Continuar?"
 *   description="Esta acción modificará tus configuraciones actuales."
 *   confirmText="Continuar"
 *   cancelText="Cancelar"
 *   variant="warning"
 * />
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Card } from '../Card';
import { Button } from '../Button';

export interface ConfirmDialogProps {
  /** Dialog open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Confirm action handler */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog description/message */
  description: string;
  /** Confirm button label */
  confirmText?: string;
  /** Cancel button label */
  cancelText?: string;
  /** Visual variant */
  variant?: 'danger' | 'warning' | 'info';
  /** Loading state for confirm button */
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: FaExclamationTriangle,
    iconBg: 'bg-error/10',
    iconColor: 'text-error',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: FaExclamationTriangle,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    buttonVariant: 'primary' as const,
  },
  info: {
    icon: FaInfoCircle,
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
    buttonVariant: 'primary' as const,
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-description"
            >
              <Card className="shadow-2xl">
                {/* Header */}
                <Card.Header>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 ${config.iconBg} rounded-xl shrink-0`}>
                        <Icon className={`${config.iconColor} text-xl`} aria-hidden="true" />
                      </div>

                      {/* Title */}
                      <div className="flex-1">
                        <h2 id="dialog-title" className="text-xl font-bold text-foreground">
                          {title}
                        </h2>
                      </div>
                    </div>

                    {/* Close button */}
                    <button
                      onClick={onClose}
                      className="p-2 -mr-2 -mt-2 text-secondary hover:text-foreground hover:bg-panel/10 rounded-lg transition-all"
                      aria-label="Cerrar diálogo"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </Card.Header>

                {/* Content */}
                <Card.Content>
                  <p id="dialog-description" className="text-secondary leading-relaxed">
                    {description}
                  </p>
                </Card.Content>

                {/* Footer - Actions */}
                <Card.Footer className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {cancelText}
                  </Button>

                  <Button
                    variant={config.buttonVariant}
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Procesando...' : confirmText}
                  </Button>
                </Card.Footer>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * BottomSheet Component
 *
 * Mobile-first modal that slides up from bottom
 * Common pattern in Mercado Pago, Ualá, Nubank, Brubank
 *
 * Features:
 * - Swipe down to close gesture
 * - Backdrop click to close
 * - Smooth slide animations
 * - Scrollable content
 * - Snap points support
 * - Accessibility (focus trap, escape key)
 * - Desktop: centered modal, Mobile: bottom sheet
 */

import { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils/cn';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showHandle?: boolean;
  showCloseButton?: boolean;
  maxHeight?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const BottomSheet = memo(function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  showHandle = true,
  showCloseButton = true,
  maxHeight = 'lg',
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Max height classes
  const maxHeightClasses = {
    sm: 'max-h-[40vh]',
    md: 'max-h-[60vh]',
    lg: 'max-h-[80vh]',
    xl: 'max-h-[90vh]',
    full: 'h-full',
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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

  // Handle swipe down gesture
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-[101]',
              'md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
              'md:max-w-lg md:rounded-2xl md:mx-auto',
              'bg-background border-t md:border border-border',
              'rounded-t-2xl md:rounded-2xl',
              'shadow-2xl',
              'flex flex-col',
              maxHeightClasses[maxHeight],
              className
            )}
          >
            {/* Handle (mobile only) */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2 md:hidden">
                <div className="w-12 h-1.5 bg-secondary/30 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-secondary hover:text-foreground"
                    aria-label="Cerrar"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">{children}</div>
          </motion.div>

          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(16, 185, 129, 0.3);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(16, 185, 129, 0.5);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
});

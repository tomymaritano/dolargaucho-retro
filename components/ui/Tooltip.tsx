import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = React.memo(function Tooltip({
  content,
  children,
  position = 'top',
  delay = 0,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 4 : -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? 4 : -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${getPositionStyles()} z-50 pointer-events-none`}
          >
            <div className="px-3 py-1.5 bg-panel/95 backdrop-blur-md border border-white/5 rounded-lg shadow-xl">
              <p className="text-xs font-medium text-foreground whitespace-nowrap">{content}</p>
            </div>

            {/* Arrow */}
            <div
              className={`absolute ${
                position === 'top'
                  ? 'top-full left-1/2 -translate-x-1/2 -mt-[1px]'
                  : position === 'bottom'
                    ? 'bottom-full left-1/2 -translate-x-1/2 -mb-[1px]'
                    : position === 'left'
                      ? 'left-full top-1/2 -translate-y-1/2 -ml-[1px]'
                      : 'right-full top-1/2 -translate-y-1/2 -mr-[1px]'
              }`}
            >
              <div
                className={`
                  w-2 h-2 bg-panel/95 border-white/10 rotate-45
                  ${position === 'top' ? 'border-r border-b' : ''}
                  ${position === 'bottom' ? 'border-l border-t' : ''}
                  ${position === 'left' ? 'border-r border-t' : ''}
                  ${position === 'right' ? 'border-l border-b' : ''}
                `}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

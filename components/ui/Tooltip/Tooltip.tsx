'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  icon?: boolean;
}

export function Tooltip({ content, children, placement = 'top', icon = true }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + 8;
          break;
      }

      // Keep tooltip within viewport
      const padding = 8;
      if (left < padding) left = padding;
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding;
      }
      if (top < padding) top = padding;

      setPosition({ top, left });
    }
  }, [isVisible, placement]);

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex items-center gap-1 cursor-help"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
      >
        {children}
        {icon && (
          <FaInfoCircle className="text-secondary hover:text-accent-emerald transition-colors text-xs" />
        )}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-xs text-foreground bg-panel border border-border rounded-lg max-w-7xl pointer-events-none animate-in fade-in duration-150"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-panel border-border rotate-45 ${
              placement === 'top'
                ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b'
                : placement === 'bottom'
                  ? 'top-[-5px] left-1/2 -translate-x-1/2 border-l border-t'
                  : placement === 'left'
                    ? 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r'
                    : 'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
        </div>
      )}
    </>
  );
}

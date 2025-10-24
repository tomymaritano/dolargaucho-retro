import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
  className?: string;
}

export const Breadcrumbs = React.memo(function Breadcrumbs({
  items,
  className = '',
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <motion.div
            key={`${item.label}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-sm text-secondary hover:text-brand transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`text-sm ${isLast ? 'text-foreground font-medium' : 'text-secondary'}`}
              >
                {item.label}
              </span>
            )}

            {!isLast && <FaChevronRight className="text-xs text-secondary" />}
          </motion.div>
        );
      })}
    </nav>
  );
});

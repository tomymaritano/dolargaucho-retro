'use client';

import React from 'react';
import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

interface DisclaimerBannerProps {
  message?: string;
  learnMoreUrl?: string;
  variant?: 'warning' | 'info';
}

export function DisclaimerBanner({
  message = 'Estimaciones aproximadas con fines informativos',
  learnMoreUrl = '/help',
  variant = 'warning',
}: DisclaimerBannerProps) {
  const colors = {
    warning: {
      bg: 'bg-yellow-500/5',
      border: 'border-yellow-500/20',
      icon: 'text-yellow-500',
      text: 'text-yellow-100/80',
      link: 'text-yellow-200 hover:text-yellow-100',
    },
    info: {
      bg: 'bg-accent-blue/5',
      border: 'border-accent-blue/20',
      icon: 'text-accent-blue',
      text: 'text-secondary',
      link: 'text-brand hover:text-brand-light',
    },
  };

  const style = colors[variant];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg px-4 py-3`}>
      <div className="flex items-center gap-3">
        <FaExclamationTriangle className={`${style.icon} flex-shrink-0`} />
        <p className={`text-sm ${style.text} flex-1`}>
          {message}.{' '}
          <Link href={learnMoreUrl} className={`${style.link} font-medium underline`}>
            Más información
          </Link>
        </p>
      </div>
    </div>
  );
}

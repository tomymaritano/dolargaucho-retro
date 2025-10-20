'use client';

/**
 * ThemedImage Component
 *
 * Image that adapts to light/dark theme
 * Shows different images based on current theme
 */

import React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ImageProps } from 'next/image';

interface ThemedImageProps extends Omit<ImageProps, 'src'> {
  srcLight: string;
  srcDark: string;
  fallback?: string; // Optional fallback image
}

export function ThemedImage({
  srcLight,
  srcDark,
  fallback,
  alt,
  className = '',
  ...props
}: ThemedImageProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting for client-side mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use resolvedTheme (accounts for system preference) or theme
  const currentTheme = resolvedTheme || theme;

  // Show fallback or dark image during SSR to avoid flash
  const src = !mounted ? fallback || srcDark : currentTheme === 'light' ? srcLight : srcDark;

  return (
    <Image
      src={src}
      alt={alt}
      className={`transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'} ${className}`}
      {...props}
    />
  );
}

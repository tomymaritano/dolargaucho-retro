'use client';

import { useTheme } from 'next-themes';

export function useChartTheme() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return {
    // Grid color - more visible
    gridColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',

    // Axis colors - more visible
    axisColor: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',

    // Tooltip background
    tooltipBg: isDark ? 'rgba(26, 31, 58, 0.95)' : 'rgba(249, 250, 251, 0.95)',

    // Tooltip text color
    tooltipColor: isDark ? '#f8f9fa' : '#1a1a1a',

    // Tooltip border
    tooltipBorder: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',

    theme,
    isDark,
  };
}

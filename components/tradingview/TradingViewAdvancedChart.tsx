/**
 * TradingView Advanced Chart Component
 *
 * Integrates TradingView's Advanced Chart widget for professional technical analysis
 * Features:
 * - Multiple timeframes
 * - Technical indicators
 * - Drawing tools
 * - Professional charting
 */

'use client';

import React, { useEffect, useRef } from 'react';

interface TradingViewAdvancedChartProps {
  symbol?: string; // Trading pair (e.g., "BINANCE:BTCUSDT", "NASDAQ:AAPL")
  width?: string | number;
  height?: string | number;
  interval?: string; // Default timeframe (e.g., "D", "60", "1")
  theme?: 'light' | 'dark';
  style?: '1' | '2' | '3'; // 1=bars, 2=candles, 3=line
  locale?: string;
  timezone?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  save_image?: boolean;
  hide_side_toolbar?: boolean;
  hide_top_toolbar?: boolean;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export function TradingViewAdvancedChart({
  symbol = 'BINANCE:BTCUSDT',
  width = '100%',
  height = 600,
  interval = 'D',
  theme = 'dark',
  style = '2',
  locale = 'es',
  timezone = 'America/Argentina/Buenos_Aires',
  toolbar_bg = '#1B1B1B',
  enable_publishing = false,
  allow_symbol_change = true,
  save_image = true,
  hide_side_toolbar = false,
  hide_top_toolbar = false,
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create script element for TradingView library
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        // Clear previous widget
        if (widgetRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Create new widget
        widgetRef.current = new window.TradingView.widget({
          autosize: width === '100%',
          width: width === '100%' ? undefined : width,
          height: height,
          symbol: symbol,
          interval: interval,
          timezone: timezone,
          theme: theme,
          style: style,
          locale: locale,
          toolbar_bg: toolbar_bg,
          enable_publishing: enable_publishing,
          allow_symbol_change: allow_symbol_change,
          save_image: save_image,
          hide_side_toolbar: hide_side_toolbar,
          hide_top_toolbar: hide_top_toolbar,
          container_id: containerRef.current.id,
          studies: [
            // Pre-load some popular indicators
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
          ],
          // Optional: Customize colors for dark theme
          overrides: {
            'paneProperties.background': '#0D0D0D',
            'paneProperties.backgroundType': 'solid',
            'paneProperties.vertGridProperties.color': 'rgba(255, 255, 255, 0.05)',
            'paneProperties.horzGridProperties.color': 'rgba(255, 255, 255, 0.05)',
            'mainSeriesProperties.candleStyle.upColor': '#10b981',
            'mainSeriesProperties.candleStyle.downColor': '#ef4444',
            'mainSeriesProperties.candleStyle.borderUpColor': '#10b981',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
            'mainSeriesProperties.candleStyle.wickUpColor': '#10b981',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
          },
        });
      }
    };

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
    if (!existingScript) {
      document.head.appendChild(script);
    } else if (window.TradingView) {
      // Script already loaded
      script.onload(new Event('load'));
    }

    return () => {
      // Cleanup
      if (widgetRef.current && containerRef.current) {
        containerRef.current.innerHTML = '';
        widgetRef.current = null;
      }
    };
  }, [
    symbol,
    width,
    height,
    interval,
    theme,
    style,
    locale,
    timezone,
    toolbar_bg,
    enable_publishing,
    allow_symbol_change,
    save_image,
    hide_side_toolbar,
    hide_top_toolbar,
  ]);

  return (
    <div
      id={`tradingview_${Math.random().toString(36).substring(7)}`}
      ref={containerRef}
      className="tradingview-widget-container rounded-lg overflow-hidden border border-border"
      style={{ width, height }}
    />
  );
}

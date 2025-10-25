import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Ignore ESLint errors during build (can fix gradually)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'zvmxlvgonwnkgsjnyxje.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },

  // On-demand entries optimization (prevents Fast Refresh loops)
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Webpack configuration (works with both Turbopack and Webpack)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.watchOptions = {
        // Delay rebuild by 300ms
        aggregateTimeout: 300,
        // Check for changes every second
        poll: 1000,
        // Ignore these directories to prevent unnecessary rebuilds
        ignored: ['**/node_modules', '**/.git', '**/.next', '**/docs'],
      };
    }

    return config;
  },

  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@tanstack/react-query', 'framer-motion', 'react-icons'],
  },
};

// Serwist PWA Configuration
const withSerwist = withSerwistInit({
  // Service Worker source file
  swSrc: 'app/sw.ts',
  // Output destination for compiled service worker
  swDest: 'public/sw.js',
  // Disable in development to avoid errors
  disable: process.env.NODE_ENV === 'development',
  // Cache navigation requests
  cacheOnNavigation: true,
  // Reload when coming back online
  reloadOnOnline: true,
});

export default withSerwist(nextConfig);

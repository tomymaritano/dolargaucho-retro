import type { NextConfig } from 'next';
// @ts-expect-error - next-pwa doesn't have type definitions
import withPWA from 'next-pwa';

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

// PWA Configuration - Only enable in production
const isProd = process.env.NODE_ENV === 'production';

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/dolarapi\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'dolarapi-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60, // 1 minute
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^https:\/\/api\.argentinadatos\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'argentinadatos-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 300, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
};

// Only apply PWA wrapper in production to avoid dev errors
export default isProd ? withPWA(pwaConfig)(nextConfig) : nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'https://zvmxlvgonwnkgsjnyxje.supabase.co/storage/v1/s3'],
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

export default nextConfig;

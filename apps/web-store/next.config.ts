import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@noeve/api-client', '@noeve/shared-types', '@noeve/ui-tokens'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'http', hostname: 'localhost', port: '9000' },
    ],
  },
};

export default nextConfig;

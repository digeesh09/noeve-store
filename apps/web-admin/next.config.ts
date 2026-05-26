import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@noeve/api-client', '@noeve/shared-types', '@noeve/ui-tokens'],
};

export default nextConfig;

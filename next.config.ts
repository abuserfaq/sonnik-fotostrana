import path from 'path';
import type { NextConfig } from 'next';

const tracingRoot =
  process.env.VERCEL || process.env.VERCEL_ENV
    ? undefined
    : path.join(__dirname);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(tracingRoot !== undefined && {
    outputFileTracingRoot: tracingRoot,
  }),
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

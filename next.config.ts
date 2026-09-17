import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lghmhyyfqfgfojlekrsq.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      // Comment attachments are capped at 5MB in the UI; leave headroom for multipart overhead.
      bodySizeLimit: '6mb',
    },
  },
  async headers() {
    const noIndex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];
    return [
      { source: '/portal/:path*', headers: noIndex },
      { source: '/admin/:path*', headers: noIndex },
      { source: '/auth/:path*', headers: noIndex },
    ];
  },
};

export default nextConfig;

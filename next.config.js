const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/placehold\.co\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/uiverse\.io\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uiverse.io',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.boardmaster.site https://pagead2.googlesyndication.com https://*.google.com https://*.googleapis.com https://*.gstatic.com;
              style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://*.googleapis.com;
              img-src 'self' blob: data: https://*.clerk.accounts.dev https://*.clerk.com https://pagead2.googlesyndication.com https://*.google.com https://*.googleapis.com https://*.gstatic.com;
              font-src 'self' data: https://*.googleapis.com https://*.gstatic.com;
              connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.boardmaster.site wss://*.clerk.accounts.dev https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.doubleclick.net https://*.googlesyndication.com https://ep1.adtrafficquality.google;
              frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://pagead2.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.googlesyndication.com;
              worker-src 'self' blob:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
});

module.exports = nextConfig; 
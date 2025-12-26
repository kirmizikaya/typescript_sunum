import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imaj.emlakjet.com',
        pathname: '/**',
      },
    ],
  },
  
  // Demo sayfaları için cache kontrolü
  async headers() {
    return [
      // Edge Cache demo - 5 dakika cache
      {
        source: '/CF/demos/edge-cache',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=300',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=300',
          },
        ],
      },
      // Early Hints demo - 5 dakika cache + Link header
      {
        source: '/CF/demos/early-hints',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=300',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=300',
          },
          {
            key: 'Link',
            value: '<https://imaj.emlakjet.com>; rel=preconnect, <https://api.emlakjet.com>; rel=preconnect',
          },
          {
            key: 'X-Early-Hints',
            value: 'enabled',
          },
        ],
      },
      // No-cache demo'lar - cache kapalı
      {
        source: '/CF/demos/no-cache-slow',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-store',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'no-store',
          },
        ],
      },
      {
        source: '/CF/demos/no-cache-fast',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-store',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'no-store',
          },
        ],
      },
      // SWR demo - stale-while-revalidate
      {
        source: '/CF/demos/stale-while-revalidate',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=10, s-maxage=10, stale-while-revalidate=290',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'public, max-age=10, stale-while-revalidate=290',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=10, stale-while-revalidate=290',
          },
        ],
      },
      // Cache-status demo - default
      {
        source: '/CF/demos/cache-status',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Cloudflare Edge Cache Simulation Proxy
 * 
 * Bu proxy, Cloudflare'ın cache davranışını simüle eder.
 * Network tab'ında gerçek CF-Cache-Status header'larını gösterir.
 * 
 * Next.js 16+ sürümünde middleware yerine proxy kullanılır.
 */

// CF Ray ID generator - Cloudflare'ın unique request ID'si
function generateCFRay(): string {
  const chars = '0123456789abcdef';
  let ray = '';
  for (let i = 0; i < 16; i++) {
    ray += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${ray}-IST`;
}

// Random latency generator
function randomLatency(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const now = Date.now();

  // Sadece CF demo sayfaları için çalış
  if (!pathname.startsWith('/CF/demos/')) {
    return response;
  }

  // Common Cloudflare Headers - her response'a eklenir
  response.headers.set('CF-Ray', generateCFRay());
  response.headers.set('Server', 'cloudflare');
  response.headers.set('X-Powered-By', 'Cloudflare Edge Simulation');
  response.headers.set('CF-Cache-Tags', 'property,demo,real-estate');

  // ==========================================
  // Demo 1: No Cache (DYNAMIC)
  // ==========================================
  if (pathname.includes('/no-cache')) {
    response.headers.set('CF-Cache-Status', 'DYNAMIC');
    response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    response.headers.set('X-Response-Time', `${randomLatency(800, 1200)}ms`);
    response.headers.set('X-Cache-Strategy', 'none');
    return response;
  }

  // ==========================================
  // Demo 2: Basic Edge Cache (HIT/MISS)
  // Cookie-based state kullanarak cache simülasyonu
  // ==========================================
  if (pathname.includes('/edge-cache')) {
    const cacheTimestamp = request.cookies.get('cf-edge-cache-ts')?.value;
    const maxAge = 3600; // 1 hour
    
    response.headers.set('X-Cache-Strategy', 'basic');
    response.headers.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
    
    if (cacheTimestamp) {
      const age = Math.floor((now - Number(cacheTimestamp)) / 1000);
      
      if (age < maxAge) {
        // Cache HIT - Edge'den servis ediliyor
        response.headers.set('CF-Cache-Status', 'HIT');
        response.headers.set('Age', String(age));
        response.headers.set('X-Response-Time', `${randomLatency(10, 25)}ms`);
        response.headers.set('X-Cache-Hit', 'true');
        return response;
      }
    }
    
    // Cache MISS - Origin'den alınıyor, cache'e yazılıyor
    response.cookies.set('cf-edge-cache-ts', String(now), { 
      path: '/CF/demos/edge-cache',
      maxAge: maxAge,
      httpOnly: true
    });
    response.headers.set('CF-Cache-Status', 'MISS');
    response.headers.set('Age', '0');
    response.headers.set('X-Response-Time', `${randomLatency(800, 1200)}ms`);
    response.headers.set('X-Cache-Hit', 'false');
    return response;
  }

  // ==========================================
  // Demo 3: Stale-While-Revalidate
  // ==========================================
  if (pathname.includes('/stale-while-revalidate')) {
    const cacheTimestamp = request.cookies.get('cf-swr-cache-ts')?.value;
    const maxAge = 10; // 10 seconds fresh
    const swrWindow = 15; // 15 seconds SWR window
    
    response.headers.set('X-Cache-Strategy', 'swr');
    response.headers.set('Cache-Control', `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=${swrWindow}`);
    
    if (cacheTimestamp) {
      const age = Math.floor((now - Number(cacheTimestamp)) / 1000);
      
      if (age < maxAge) {
        // Fresh - HIT
        response.headers.set('CF-Cache-Status', 'HIT');
        response.headers.set('Age', String(age));
        response.headers.set('X-Response-Time', `${randomLatency(10, 25)}ms`);
        response.headers.set('X-Cache-State', 'fresh');
        return response;
      }
      
      if (age < maxAge + swrWindow) {
        // Stale but in SWR window - serve stale, revalidate in background
        response.headers.set('CF-Cache-Status', 'STALE');
        response.headers.set('Age', String(age));
        response.headers.set('X-Response-Time', `${randomLatency(10, 20)}ms`);
        response.headers.set('X-Background-Revalidation', 'true');
        response.headers.set('X-Cache-State', 'stale-serving');
        
        // Update cache timestamp (simulate background revalidation completed)
        response.cookies.set('cf-swr-cache-ts', String(now), {
          path: '/CF/demos/stale-while-revalidate',
          maxAge: maxAge + swrWindow,
          httpOnly: true
        });
        return response;
      }
      
      // Expired - beyond SWR window
      response.cookies.set('cf-swr-cache-ts', String(now), {
        path: '/CF/demos/stale-while-revalidate',
        maxAge: maxAge + swrWindow,
        httpOnly: true
      });
      response.headers.set('CF-Cache-Status', 'EXPIRED');
      response.headers.set('Age', '0');
      response.headers.set('X-Response-Time', `${randomLatency(800, 1200)}ms`);
      response.headers.set('X-Cache-State', 'expired');
      return response;
    }
    
    // First request - MISS
    response.cookies.set('cf-swr-cache-ts', String(now), {
      path: '/CF/demos/stale-while-revalidate',
      maxAge: maxAge + swrWindow,
      httpOnly: true
    });
    response.headers.set('CF-Cache-Status', 'MISS');
    response.headers.set('Age', '0');
    response.headers.set('X-Response-Time', `${randomLatency(800, 1200)}ms`);
    response.headers.set('X-Cache-State', 'miss');
    return response;
  }

  // ==========================================
  // Demo 4: Early Hints (103)
  // ==========================================
  if (pathname.includes('/early-hints')) {
    const cacheTimestamp = request.cookies.get('cf-hints-cache-ts')?.value;
    const maxAge = 3600;
    
    // Early Hints headers - gerçek kritik kaynakları preconnect/dns-prefetch et
    // Not: preload yerine preconnect kullanıyoruz çünkü font/css dosyaları local değil
    response.headers.set('Link', [
      '<https://imaj.emlakjet.com>; rel=preconnect',
      '<https://api.emlakjet.com>; rel=preconnect',
      '<https://www.googletagmanager.com>; rel=preconnect',
      '<https://connect.facebook.net>; rel=dns-prefetch'
    ].join(', '));
    response.headers.set('X-Early-Hints', 'sent');
    response.headers.set('X-Cache-Strategy', 'early-hints');
    response.headers.set('Cache-Control', `public, max-age=${maxAge}`);
    
    if (cacheTimestamp) {
      const age = Math.floor((now - Number(cacheTimestamp)) / 1000);
      if (age < maxAge) {
        response.headers.set('CF-Cache-Status', 'HIT');
        response.headers.set('Age', String(age));
        response.headers.set('X-Response-Time', `${randomLatency(10, 25)}ms`);
        return response;
      }
    }
    
    response.cookies.set('cf-hints-cache-ts', String(now), {
      path: '/CF/demos/early-hints',
      maxAge: maxAge,
      httpOnly: true
    });
    response.headers.set('CF-Cache-Status', 'MISS');
    response.headers.set('Age', '0');
    response.headers.set('X-Response-Time', `${randomLatency(800, 1200)}ms`);
    return response;
  }

  // ==========================================
  // Demo 5: Cache Status Reference
  // ==========================================
  if (pathname.includes('/cache-status')) {
    response.headers.set('CF-Cache-Status', 'HIT');
    response.headers.set('Cache-Control', 'public, max-age=3600');
    response.headers.set('Age', '120');
    response.headers.set('X-Response-Time', `${randomLatency(10, 20)}ms`);
    response.headers.set('X-Cache-Strategy', 'reference');
    return response;
  }

  return response;
}

// Matcher - sadece CF demo sayfaları için çalış
export const config = {
  matcher: [
    '/CF/demos/:path*',
  ],
};


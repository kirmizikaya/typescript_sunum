import { NextRequest, NextResponse } from 'next/server';
import { getPropertyData } from '../../../lib/property-service';

// In-memory cache simulation
const cache = new Map<string, { data: unknown; timestamp: number; maxAge: number }>();

// Cache configuration based on demo type
type CacheStrategy = 'none' | 'basic' | 'swr';

function getCacheStrategy(searchParams: URLSearchParams): CacheStrategy {
  const strategy = searchParams.get('strategy') as CacheStrategy;
  return strategy || 'basic';
}

function generateCFRay(): string {
  const chars = '0123456789abcdef';
  let ray = '';
  for (let i = 0; i < 16; i++) {
    ray += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${ray}-IST`;
}

async function simulateOriginLatency(min = 800, max = 1200): Promise<number> {
  const latency = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, latency));
  return latency;
}

async function simulateEdgeLatency(min = 10, max = 25): Promise<number> {
  const latency = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, latency));
  return latency;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const strategy = getCacheStrategy(searchParams);
  const forceStatus = searchParams.get('forceStatus'); // For demo 5
  
  const cacheKey = `property-${id}-${strategy}`;
  const now = Date.now();
  
  // Get property data from service (0 latency - API kendi latency'sini simüle ediyor)
  const responseData = await getPropertyData(id, 0);

  // Common headers
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'CF-Ray': generateCFRay(),
    'X-Powered-By': 'Cloudflare Demo'
  };

  // Force specific status for Demo 5
  if (forceStatus) {
    const latency = ['HIT', 'STALE', 'REVALIDATED', 'UPDATING'].includes(forceStatus)
      ? await simulateEdgeLatency()
      : await simulateOriginLatency();
    
    return NextResponse.json(responseData, {
      headers: {
        ...baseHeaders,
        'CF-Cache-Status': forceStatus,
        'Cache-Control': 'public, max-age=3600',
        'X-Response-Time': `${latency}ms`,
        'Age': forceStatus === 'HIT' ? '120' : '0'
      }
    });
  }

  // Strategy: None (no caching)
  if (strategy === 'none') {
    const latency = await simulateOriginLatency();
    return NextResponse.json(responseData, {
      headers: {
        ...baseHeaders,
        'CF-Cache-Status': 'DYNAMIC',
        'Cache-Control': 'private, no-store',
        'X-Response-Time': `${latency}ms`
      }
    });
  }

  // Strategy: Basic caching
  if (strategy === 'basic') {
    const cached = cache.get(cacheKey);
    
    if (cached && (now - cached.timestamp) < cached.maxAge) {
      // Cache HIT
      const latency = await simulateEdgeLatency();
      const age = Math.floor((now - cached.timestamp) / 1000);
      
      return NextResponse.json(cached.data, {
        headers: {
          ...baseHeaders,
          'CF-Cache-Status': 'HIT',
          'Cache-Control': 'public, max-age=3600',
          'Age': String(age),
          'X-Response-Time': `${latency}ms`
        }
      });
    }
    
    // Cache MISS
    const latency = await simulateOriginLatency();
    
    // Store in cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: now,
      maxAge: 3600 * 1000 // 1 hour
    });
    
    return NextResponse.json(responseData, {
      headers: {
        ...baseHeaders,
        'CF-Cache-Status': 'MISS',
        'Cache-Control': 'public, max-age=3600',
        'X-Response-Time': `${latency}ms`
      }
    });
  }

  // Strategy: SWR (stale-while-revalidate)
  if (strategy === 'swr') {
    const cached = cache.get(cacheKey);
    const maxAge = 10 * 1000; // 10 seconds for demo
    const swrWindow = 15 * 1000; // 15 seconds SWR window
    
    if (cached) {
      const age = now - cached.timestamp;
      
      if (age < maxAge) {
        // Fresh - serve from cache
        const latency = await simulateEdgeLatency();
        return NextResponse.json(cached.data, {
          headers: {
            ...baseHeaders,
            'CF-Cache-Status': 'HIT',
            'Cache-Control': `public, max-age=0, s-maxage=10, stale-while-revalidate=15`,
            'Age': String(Math.floor(age / 1000)),
            'X-Response-Time': `${latency}ms`
          }
        });
      }
      
      if (age < maxAge + swrWindow) {
        // Stale but within SWR window - serve stale, trigger background revalidation
        const latency = await simulateEdgeLatency();
        
        // Simulate background revalidation (update cache)
        setTimeout(async () => {
          await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate origin latency
          cache.set(cacheKey, {
            data: { ...responseData, fetchedAt: new Date().toISOString() },
            timestamp: Date.now(),
            maxAge: maxAge
          });
        }, 0);
        
        return NextResponse.json(cached.data, {
          headers: {
            ...baseHeaders,
            'CF-Cache-Status': 'STALE',
            'Cache-Control': `public, max-age=0, s-maxage=10, stale-while-revalidate=15`,
            'Age': String(Math.floor(age / 1000)),
            'X-Response-Time': `${latency}ms`,
            'X-Background-Revalidation': 'true'
          }
        });
      }
    }
    
    // Expired or not cached - fetch from origin
    const latency = await simulateOriginLatency();
    
    cache.set(cacheKey, {
      data: responseData,
      timestamp: now,
      maxAge: maxAge
    });
    
    return NextResponse.json(responseData, {
      headers: {
        ...baseHeaders,
        'CF-Cache-Status': cached ? 'EXPIRED' : 'MISS',
        'Cache-Control': `public, max-age=0, s-maxage=10, stale-while-revalidate=15`,
        'X-Response-Time': `${latency}ms`
      }
    });
  }

  // Default fallback
  const latency = await simulateOriginLatency();
  return NextResponse.json(responseData, {
    headers: {
      ...baseHeaders,
      'CF-Cache-Status': 'DYNAMIC',
      'Cache-Control': 'private, no-store',
      'X-Response-Time': `${latency}ms`
    }
  });
}

// Clear cache endpoint
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Clear all cache entries for this property
  for (const key of cache.keys()) {
    if (key.startsWith(`property-${id}`)) {
      cache.delete(key);
    }
  }
  
  return NextResponse.json({ success: true, message: 'Cache cleared' });
}

